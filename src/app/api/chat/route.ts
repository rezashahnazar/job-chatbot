import { createOpenAI } from "@ai-sdk/openai";
import { streamText, smoothStream } from "ai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

// IMPORTANT: Set the runtime to edge
export const runtime = "edge";

const systemPrompt = `You are a helpful and friendly job application assistant chatbot for a company. 
You can provide information about two job positions:
1. Product Marketing Manager
2. Product Marketing Full-Stack Developer

You should help users understand these positions, their requirements, and assist them in determining if they're a good fit.
You should communicate in Persian (Farsi) language and be polite and professional.
You can also analyze resumes and provide feedback on how well they match with these positions.
You can analyze GitHub repositories and provide insights about the code and projects.

When users ask about positions, provide detailed information about:
- Role responsibilities
- Required skills and qualifications
- Experience level needed
- Key expectations

Always maintain a helpful and encouraging tone while being honest about requirements and fit.
If a user's qualifications don't match well with a position, suggest areas for improvement or alternative positions that might be a better fit.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Find system messages containing resume and GitHub information
  const systemMessages = messages.filter((m: any) => m.role === "system");
  const resumeContext =
    systemMessages.find((m: any) =>
      m.content?.startsWith("User's Resume Analysis")
    )?.content || "";
  const githubContext =
    systemMessages.find((m: any) =>
      m.content?.startsWith("GitHub Repository Analysis")
    )?.content || "";

  // Create an enhanced system prompt with all available context
  const enhancedSystemPrompt = `${systemPrompt}

${
  resumeContext
    ? `Resume Analysis Context:
${resumeContext}`
    : ""
}

${githubContext ? `${githubContext}` : ""}

${
  resumeContext || githubContext
    ? "Remember to use this contextual information when answering questions about the user's qualifications, projects, and providing career advice."
    : ""
}`;

  const stream = await streamText({
    model: openai("gpt-4o-mini"),
    system: enhancedSystemPrompt,
    messages: messages.filter((m: any) => m.role !== "system"), // Remove system messages from chat history
    experimental_transform: [smoothStream()],
  });

  return stream.toDataStreamResponse();
}
