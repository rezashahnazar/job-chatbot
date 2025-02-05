import { createOpenAI } from "@ai-sdk/openai";
import { streamText, smoothStream } from "ai";
import { Message } from "ai";
import { prisma } from "@/lib/db";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

// Change runtime to nodejs for Prisma compatibility
export const runtime = "nodejs";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Fetch job details from the database
  const jobs = await prisma.job.findMany({
    select: {
      title: true,
      description: true,
      requirements: true,
    },
  });

  // Format job details for the prompt
  const jobDetails = jobs
    .map(
      (job) => `
موقعیت شغلی: ${job.title}

شرح موقعیت:
${job.description}

شرایط و نیازمندی‌ها:
${job.requirements}
`
    )
    .join("\n\n---\n\n");

  // Find system messages containing resume and GitHub information
  const systemMessages = messages.filter((m: Message) => m.role === "system");
  const resumeContext =
    systemMessages.find((m: Message) =>
      m.content?.startsWith("تحلیل رزومه شما:")
    )?.content || "";
  const githubContext =
    systemMessages.find((m: Message) => m.content?.includes("نمای کلی پروژه"))
      ?.content || "";

  // Create the system prompt
  const systemPrompt = `شما یک دستیار هوشمند استخدام هستید که به کاربران در مورد موقعیت‌های شغلی، رزومه و مخزن گیت‌هاب آنها مشاوره می‌دهید.

${resumeContext ? `\n### اطلاعات رزومه:\n${resumeContext}` : ""}
${githubContext ? `\n### اطلاعات مخزن گیت‌هاب:\n${githubContext}` : ""}
${jobDetails ? `\n### موقعیت‌های شغلی موجود:\n${jobDetails}` : ""}

لطفاً با توجه به این اطلاعات به سؤالات کاربر پاسخ دهید.`;

  try {
    const stream = await streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages: messages.filter((m: Message) => m.role !== "system"),
      experimental_transform: [smoothStream()],
    });

    return stream.toDataStreamResponse();
  } catch (error) {
    console.error("OpenAI API error:", error);
    return new Response("Error: " + (error as Error).message, { status: 500 });
  }
}
