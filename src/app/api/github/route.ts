import { createOpenAI } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { streamText, smoothStream } from "ai";

interface GitHubTreeItem {
  path: string;
  type: string;
  size: number;
  sha: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

export const runtime = "edge";

async function fetchRepoContent(repoUrl: string) {
  // Extract owner and repo from URL
  const urlParts = repoUrl.replace("https://github.com/", "").split("/");
  const owner = urlParts[0];
  const repo = urlParts[1];

  const headers = {
    Accept: "application/vnd.github.v3+json",
  };

  // Fetch repository information
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch repository information");
  }

  const repoInfo = await response.json();

  // Fetch repository languages
  const languagesResponse = await fetch(repoInfo.languages_url, { headers });
  const languages = await languagesResponse.json();

  // Fetch repository tree
  const treeResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${repoInfo.default_branch}?recursive=1`,
    { headers }
  );
  const treeData = await treeResponse.json();

  // Get important files content (README, package.json, etc.)
  const importantFiles = [
    "README.md",
    "package.json",
    "requirements.txt",
    "setup.py",
    "go.mod",
    "pom.xml",
    "build.gradle",
  ];
  const fileContents: Record<string, string> = {};

  for (const file of treeData.tree as GitHubTreeItem[]) {
    if (importantFiles.some((name) => file.path.endsWith(name))) {
      const contentResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
        { headers }
      );
      if (contentResponse.ok) {
        const content = await contentResponse.json();
        fileContents[file.path] = Buffer.from(
          content.content,
          "base64"
        ).toString("utf-8");
      }
    }
  }

  // Get sample code files (up to 5 files, excluding large files and binaries)
  const codeFiles = (treeData.tree as GitHubTreeItem[])
    .filter(
      (file) =>
        file.type === "blob" &&
        file.size < 50000 &&
        /\.(js|ts|py|java|go|rb|php|cs|cpp|h|jsx|tsx|vue|rs|swift|kt)$/.test(
          file.path
        )
    )
    .slice(0, 5);

  const codeSamples: Record<string, string> = {};

  for (const file of codeFiles) {
    const contentResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
      { headers }
    );
    if (contentResponse.ok) {
      const content = await contentResponse.json();
      codeSamples[file.path] = Buffer.from(content.content, "base64").toString(
        "utf-8"
      );
    }
  }

  // Get commit history (last 10 commits)
  const commitsResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`,
    { headers }
  );
  const commits = await commitsResponse.json();

  return {
    name: repoInfo.name,
    description: repoInfo.description,
    stars: repoInfo.stargazers_count,
    forks: repoInfo.forks_count,
    languages,
    topics: repoInfo.topics,
    lastUpdate: repoInfo.updated_at,
    size: repoInfo.size,
    hasIssues: repoInfo.has_issues,
    hasWiki: repoInfo.has_wiki,
    hasPages: repoInfo.has_pages,
    defaultBranch: repoInfo.default_branch,
    fileStructure: (treeData.tree as GitHubTreeItem[]).map((item) => ({
      path: item.path,
      type: item.type,
      size: item.size,
    })),
    importantFiles: fileContents,
    codeSamples,
    recentCommits: (commits as GitHubCommit[]).map((commit) => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
    })),
  };
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const repoUrl = messages[messages.length - 1].content;
    if (!repoUrl || !repoUrl.startsWith("https://github.com/")) {
      return NextResponse.json(
        { error: "Invalid GitHub repository URL" },
        { status: 400 }
      );
    }

    const repoContent = await fetchRepoContent(repoUrl);

    // Use streamText which is compatible with useChat
    const response = await streamText({
      model: openai("gpt-4o-mini"),
      experimental_transform: [smoothStream()],
      system: `You are a technical recruiter evaluating GitHub repositories. Analyze the repository information and provide a detailed evaluation focusing on:
1. Project Overview
   - Basic repository information
   - Project purpose and goals
   - Technology stack and dependencies

2. Code Quality Analysis
   - Code organization and structure
   - Coding standards and conventions
   - Error handling and logging
   - Comments and documentation
   - Sample code analysis with specific examples

3. Development Practices
   - Git commit history and patterns
   - Testing approach (if present)
   - CI/CD implementation (if present)
   - Code review practices (if visible)

4. Technical Skills Demonstrated
   - Programming languages used
   - Frameworks and libraries
   - Architecture patterns
   - Problem-solving approaches

5. Project Structure
   - Directory organization
   - Configuration management
   - Resource organization
   - Build and deployment setup

6. Areas for Improvement
   - Code quality suggestions
   - Architecture recommendations
   - Testing coverage
   - Documentation completeness

7. Overall Assessment
   - Project maturity
   - Code maintainability
   - Technical sophistication
   - Best practices followed

Include specific code examples when discussing interesting patterns or areas for improvement. Format code blocks using markdown.
Provide the analysis in Persian (Farsi) language.`,
      messages: [
        ...messages,
        {
          role: "assistant",
          content: `تحلیل مخزن گیت‌هاب:\n\nدر حال بررسی مخزن ${repoUrl}...\n\n${JSON.stringify(
            repoContent,
            null,
            2
          )}`,
        },
      ],
    });

    return response.toDataStreamResponse();
  } catch (error) {
    console.error("GitHub analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze repository" },
      { status: 500 }
    );
  }
}
