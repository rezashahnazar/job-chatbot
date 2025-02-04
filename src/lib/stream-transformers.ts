import { CoreTool, StreamTextTransform } from "ai";

interface Message {
  role: string;
  content: string;
}

export function monitorStream(): StreamTextTransform<Record<string, CoreTool>> {
  let messageContent = "";
  let chunkCount = 0;
  let tokenCount = 0;
  const startTime = Date.now();
  const formatTime = () => new Date().toISOString();
  const formatDuration = (ms: number) => `${(ms / 1000).toFixed(2)}s`;

  const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    red: "\x1b[31m",
  };

  const logSection = (title: string, data: Record<string, unknown>) => {
    console.log(`${colors.bright}${title}${colors.reset}`);
    Object.entries(data).forEach(([key, value]) => {
      console.log(`${colors.dim}├─ ${key}:${colors.reset}`, value);
    });
  };

  if (process.env.NODE_ENV === "development") {
    return () => {
      return new TransformStream({
        start() {
          console.log("\n" + "=".repeat(80));
          console.log(
            `${colors.bright}🚀 AI STREAM STARTED AT ${formatTime()}${
              colors.reset
            }\n`
          );
        },

        transform(chunk, controller) {
          chunkCount++;
          const currentDuration = Date.now() - startTime;

          switch (chunk.type) {
            case "step-start":
              const requestBody = chunk.request.body
                ? JSON.parse(chunk.request.body)
                : {};

              logSection("📥 REQUEST DETAILS", {
                "Message ID": chunk.messageId,
                Model: requestBody.model,
                Temperature: requestBody.temperature ?? "default",
                "Max Tokens": requestBody.max_tokens ?? "default",
                "System Prompt":
                  requestBody.messages.find((m: Message) => m.role === "system")
                    ?.content ?? "none",
                "User Message":
                  requestBody.messages.find((m: Message) => m.role === "user")
                    ?.content ?? "none",
              });
              break;

            case "text-delta":
              messageContent += chunk.textDelta;
              tokenCount += chunk.textDelta.length / 4; // Rough estimation
              console.log(
                `${colors.green}📝 ${chunk.textDelta}${colors.reset}`
              );
              break;

            case "step-finish":
              console.log("\n");
              logSection("📊 STREAM METRICS", {
                Duration: formatDuration(currentDuration),
                "Average Speed": `${(
                  tokenCount /
                  (currentDuration / 1000)
                ).toFixed(2)} tokens/sec`,
                "Chunks Processed": chunkCount,
                "Message Length": `${messageContent.length} chars`,
                "Estimated Tokens": Math.ceil(tokenCount),
                "Token Usage": chunk.usage,
                "Finish Reason": chunk.finishReason,
              });

              logSection("📝 COMPLETE MESSAGE", {
                Content: messageContent,
              });
              break;

            case "error":
              console.log("\n");
              logSection("❌ ERROR OCCURRED", {
                Error: chunk.error,
                Duration: formatDuration(currentDuration),
              });
              break;

            case "finish":
              console.log("\n");
              logSection("✨ FINAL STATISTICS", {
                "Total Duration": formatDuration(currentDuration),
                "Total Chunks": chunkCount,
                "Final Message Length": messageContent.length,
                "Estimated Total Tokens": Math.ceil(tokenCount),
                "Average Processing Speed": `${(
                  chunkCount /
                  (currentDuration / 1000)
                ).toFixed(2)} chunks/sec`,
              });
              console.log("\n" + "=".repeat(80) + "\n");
              break;

            default:
              console.log(
                `${colors.yellow}ℹ️ Unknown Chunk Type:${colors.reset}`,
                chunk
              );
          }

          controller.enqueue(chunk);
        },
      });
    };
  } else {
    return () => {
      return new TransformStream({
        transform(chunk, controller) {
          controller.enqueue(chunk);
        },
      });
    };
  }
}
