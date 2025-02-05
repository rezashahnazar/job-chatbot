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

export const runtime = "nodejs";

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

  // Ensure commits is an array before mapping
  const recentCommits = Array.isArray(commits)
    ? commits.map((commit: GitHubCommit) => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: commit.commit.author.date,
      }))
    : [];

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
    recentCommits,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Handle both direct URL and chat message formats
    let repoUrl: string;
    let existingMessages = [];

    if (body.url) {
      // Direct URL format
      repoUrl = body.url;
      existingMessages = [
        {
          id: Date.now().toString(),
          role: "user",
          content: repoUrl,
          createdAt: new Date(),
        },
      ];
    } else if (body.messages) {
      // Chat message format
      const { messages } = body;
      if (!Array.isArray(messages) || messages.length === 0) {
        return NextResponse.json(
          { error: "لطفاً یک آدرس معتبر مخزن گیت‌هاب وارد کنید" },
          { status: 400 }
        );
      }

      const lastMessage = messages[messages.length - 1];
      if (!lastMessage?.content) {
        return NextResponse.json(
          { error: "لطفاً یک آدرس معتبر مخزن گیت‌هاب وارد کنید" },
          { status: 400 }
        );
      }
      repoUrl = lastMessage.content;
      existingMessages = messages;
    } else {
      return NextResponse.json(
        { error: "لطفاً یک آدرس معتبر مخزن گیت‌هاب وارد کنید" },
        { status: 400 }
      );
    }

    if (!repoUrl || !repoUrl.startsWith("https://github.com/")) {
      return NextResponse.json(
        { error: "لطفاً یک آدرس معتبر مخزن گیت‌هاب وارد کنید" },
        { status: 400 }
      );
    }

    const repoContent = await fetchRepoContent(repoUrl);

    // Use streamText which is compatible with useChat
    const response = await streamText({
      model: openai("gpt-4o-mini"),
      experimental_transform: [smoothStream()],
      system: `شما یک متخصص تحلیل کد و مخازن گیت‌هاب هستید. لطفاً مخزن زیر را تحلیل کنید و موارد زیر را بررسی کنید:

1. نمای کلی پروژه
   - اطلاعات پایه مخزن
   - هدف و کاربرد پروژه
   - تکنولوژی‌ها و وابستگی‌ها

2. تحلیل کیفیت کد
   - سازماندهی و ساختار کد
   - استانداردها و قراردادهای کدنویسی
   - مدیریت خطا و لاگ‌گیری
   - مستندات و توضیحات
   - تحلیل نمونه کدها با مثال‌های مشخص

3. روش‌های توسعه
   - تاریخچه کامیت‌ها و الگوها
   - رویکرد تست (در صورت وجود)
   - پیاده‌سازی CI/CD (در صورت وجود)
   - روش‌های بررسی کد

4. مهارت‌های فنی نمایش داده شده
   - زبان‌های برنامه‌نویسی استفاده شده
   - فریم‌ورک‌ها و کتابخانه‌ها
   - الگوهای معماری
   - رویکردهای حل مسئله

5. ساختار پروژه
   - سازماندهی دایرکتوری‌ها
   - مدیریت تنظیمات
   - سازماندهی منابع
   - تنظیمات ساخت و استقرار

6. زمینه‌های بهبود
   - پیشنهادات بهبود کیفیت کد
   - توصیه‌های معماری
   - پوشش تست
   - کامل بودن مستندات

7. ارزیابی کلی
   - بلوغ پروژه
   - قابلیت نگهداری کد
   - پیچیدگی فنی
   - رعایت بهترین شیوه‌ها

در صورت مشاهده الگوها یا زمینه‌های بهبود جالب، نمونه کد خاص را ذکر کنید. بلوک‌های کد را با مارک‌داون فرمت کنید.`,
      messages: [
        ...existingMessages,
        {
          role: "assistant",
          content: `در حال تحلیل مخزن ${repoUrl}...\n\n${JSON.stringify(
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
      { error: "خطا در تحلیل مخزن گیت‌هاب" },
      { status: 500 }
    );
  }
}
