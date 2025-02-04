import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { writeFile } from "fs/promises";
import { join } from "path";
import PDFParser from "pdf2json";
import { prisma } from "@/lib/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

// Configure route handlers
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Handle POST requests
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const position = formData.get("position") as string;

    // Validate required fields
    if (!file || !name || !email || !position) {
      return NextResponse.json(
        { error: "Missing required fields (name, email, position, resume)" },
        { status: 400 }
      );
    }

    // Check if it's a PDF file
    if (!file.type.includes("pdf")) {
      return NextResponse.json(
        { error: "Please upload a PDF file" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
      // Save file first
      const fileName = `${Date.now()}-${file.name}`;
      await writeFile(join(process.cwd(), "uploads", fileName), buffer);

      // Convert buffer to text using pdf2json
      const pdfParser = new PDFParser();
      const pdfText = await new Promise<string>((resolve, reject) => {
        pdfParser.on("pdfParser_dataReady", (pdfData) => {
          try {
            const text = pdfData.Pages.map((page) =>
              page.Texts.map((text) =>
                text.R?.[0]?.T ? decodeURIComponent(text.R[0].T) : ""
              ).join(" ")
            )
              .join("\n")
              .trim();
            resolve(text || "");
          } catch {
            reject(new Error("Failed to extract text from PDF"));
          }
        });

        pdfParser.on("pdfParser_dataError", () => {
          reject(new Error("Failed to parse PDF"));
        });

        pdfParser.parseBuffer(buffer);
      });

      if (!pdfText) {
        throw new Error("No text found in PDF");
      }

      // Get job details from database
      const job = await prisma.job.findFirst({
        where: {
          title: position,
        },
      });

      if (!job) {
        return NextResponse.json(
          { error: "Selected position not found" },
          { status: 400 }
        );
      }

      try {
        // Analyze resume with OpenAI
        const analysis = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a professional HR assistant analyzing resumes for job positions. 
                       Analyze the resume for the ${position} position with these requirements:
                       ${job.requirements}
                       
                       Provide:
                       1. A match score (0-100)
                       2. Key strengths
                       3. Areas for improvement
                       4. Overall feedback
                       
                       Respond in Persian language.
                       Format the response as JSON with keys: score, strengths, improvements, feedback`,
            },
            {
              role: "user",
              content: pdfText as string,
            },
          ],
          response_format: { type: "json_object" },
        });

        const aiResponse = JSON.parse(
          analysis.choices[0]?.message?.content || "{}"
        );

        // Save application to database
        const application = await prisma.application.create({
          data: {
            jobId: job.id,
            name,
            email,
            resumeUrl: fileName,
            resumeText: pdfText as string,
            feedback: aiResponse.feedback || "",
            matchScore: parseFloat(aiResponse.score) || 0,
            status: "PENDING",
          },
        });

        return NextResponse.json({
          success: true,
          applicationId: application.id,
          analysis: {
            score: aiResponse.score,
            strengths: aiResponse.strengths,
            improvements: aiResponse.improvements,
            feedback: aiResponse.feedback,
          },
        });
      } catch (apiError) {
        console.error("OpenAI API error:", apiError);
        return NextResponse.json(
          { error: "Failed to analyze resume. Please try again later." },
          { status: 500 }
        );
      }
    } catch (pdfError) {
      console.error("PDF parsing error:", pdfError);
      return NextResponse.json(
        {
          error: "Failed to parse PDF file. Please make sure it's a valid PDF.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    );
  }
}
