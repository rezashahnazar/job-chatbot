export interface ResumeAnalysis {
  score: number;
  strengths: string[];
  improvements: string[];
  feedback: string;
}

export interface Job {
  id: string;
  title: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system" | "data";
  content: string;
  createdAt?: Date;
}
