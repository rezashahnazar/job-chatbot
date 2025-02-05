import { Message, ResumeAnalysis } from "@/types/chat";

// Helper function to convert comma-separated string to markdown list
export const formatToMarkdownList = (text: string | string[]) => {
  if (!text) return "";

  // Handle array input
  if (Array.isArray(text)) {
    return text.map((item) => `- ${String(item).trim()}`).join("\n");
  }

  // Convert to string and handle comma-separated values
  const textStr = String(text);
  if (!textStr.includes(",")) {
    return `- ${textStr.trim()}`;
  }

  return textStr
    .split(",")
    .map((item) => `- ${item.trim()}`)
    .join("\n");
};

// Function to check if a message contains a GitHub repository URL
export const checkGithubUrl = (text: string) => {
  return text.match(/https:\/\/github\.com\/[\w-]+\/[\w-]+/)?.[0];
};

// Function to create a system message about the resume
export const createResumeSystemMessage = (
  analysis: ResumeAnalysis
): Message => {
  const formattedStrengths = formatToMarkdownList(analysis.strengths);
  const formattedImprovements = formatToMarkdownList(analysis.improvements);

  return {
    id: `resume-${Date.now()}`,
    role: "system",
    content: `تحلیل رزومه شما:

امتیاز تطابق: ${analysis.score ?? 0}%

نقاط قوت:
${formattedStrengths}

زمینه‌های بهبود:
${formattedImprovements}

بازخورد کلی:
${analysis.feedback ?? ""}

این اطلاعات در پاسخ به سؤالات شما درباره رزومه و تناسب شغلی استفاده خواهد شد.`,
  };
};

// Function to create a notification message about resume context
export const createResumeNotification = (): Message => {
  return {
    id: `notification-${Date.now()}`,
    role: "assistant",
    content:
      "✨ رزومه شما با موفقیت آپلود و تحلیل شد. اکنون می‌توانید سوالات خود را درباره رزومه‌تان بپرسید.",
  };
};

// Function to create a result message about resume analysis
export const createResumeResultMessage = (
  analysis: ResumeAnalysis
): Message => {
  const formattedStrengths = formatToMarkdownList(analysis.strengths);
  const formattedImprovements = formatToMarkdownList(analysis.improvements);

  return {
    id: `resume-result-${Date.now()}`,
    role: "assistant",
    content: `### 📄 نتیجه تحلیل رزومه

**امتیاز تطابق:** ${analysis.score ?? 0}%

**نقاط قوت:**
${formattedStrengths}

**زمینه‌های بهبود:**
${formattedImprovements}

**بازخورد کلی:**
${analysis.feedback ?? ""}`,
  };
};
