Title: AI SDK 4.1 - Vercel

URL Source: https://vercel.com/blog/ai-sdk-4-1

Markdown Content:
Introducing image generation, non-blocking data streaming, improved tool calling, and more.

The [AI SDK](https://sdk.vercel.ai/) is an open-source toolkit for building AI applications with JavaScript and TypeScript. Its unified provider API allows you to use any language model and enables powerful UI integrations into leading web frameworks such as [Next.js](https://nextjs.org/) and [Svelte](https://svelte.dev/).

Since our 4.0 release, we've seen some incredible products powered by the AI SDK:

- [Languine](https://languine.ai/en) is an open-source CLI tool that automates application localization, detecting translation changes and maintaining consistent tone across all major i18n libraries.
- [Scira](https://scira.app/) is a minimalist AI-powered search engine, using the AI SDK to power search-grounded LLM responses and powerful generative UI interactions.
- [Fullmoon](https://fullmoon.app/) enables cross-platform chat with private local LLMs, bringing secure AI conversations to everyone.

![Image 13](https://vercel.com/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2F3lFwDQpCGmzaCVy7Mnculp%2Fd163bd1d290f35d0ffcc0791009a5bc0%2Flanguine.png&w=1920&q=75)

Check out [Languine](https://languine.ai/), an AI-powered CLI and pipeline designed to automate translations for developers

Each of these projects is open-source ([Languine](https://github.com/midday-ai/languine), [Scira](https://github.com/zaidmukaddam/scira), [Fullmoon](https://github.com/mainframecomputer/fullmoon-web)), giving you the opportunity to explore how these AI-powered applications are built.

Today, we're announcing the release of AI SDK 4.1, which introduces [image generation capabilities](https://vercel.com/blog/ai-sdk-4-1#image-generation). This update allows developers to generate images through a unified API that works seamlessly across providers like [Replicate](https://replicate.com/), [OpenAI](https://openai.com/), [Google Vertex](https://cloud.google.com/vertex-ai), and [Fireworks](https://fireworks.ai/).

Along with image generation, this release includes:

- [Stream transformation & smoothing](https://vercel.com/blog/ai-sdk-4-1#stream-transformation-&-smoothing)
- [Simplified persistence with useChat](https://vercel.com/blog/ai-sdk-4-1#simplified-persistence-with-usechat)
- [Non-blocking data streaming](https://vercel.com/blog/ai-sdk-4-1#non-blocking-data-streaming)
- [Tool-calling improvements](https://vercel.com/blog/ai-sdk-4-1#tool-calling-improvements)
- [Structured output improvements](https://vercel.com/blog/ai-sdk-4-1#structured-output-improvements)
- [New and updated providers](https://vercel.com/blog/ai-sdk-4-1#new-and-updated-providers)

Let's explore these new features and improvements.

## [Image generation](https://vercel.com/blog/ai-sdk-4-1#image-generation)

Generating images from text prompts is a novel generative AI capability that enables new types of applications and workflows. The ecosystem is growing rapidly, with providers such as Replicate supporting hundreds of different image generation models, adding more and more every day.

With AI SDK 4.1, we're taking our first step towards enabling multi-modal outputs by introducing support for image generation through the new experimental [`generateImage`](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-image#generateimage) function.

```
import { experimental_generateImage as generateImage } from 'ai';import { replicate } from '@ai-sdk/replicate';const { image } = await generateImage({  model: replicate.image('black-forest-labs/flux-1.1-pro-ultra'),  prompt: 'A futuristic cityscape at sunset',});
```

![Image 14](https://vercel.com/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2F4iSi90keMWB4NNDKPfPr3b%2F67791d0dd5b5a847836a94b4b7435279%2Fimage-1736860667012.png&w=1920&q=75)

Image generated with Replicate's [black-forest-labs/flux-1.1-pro-ultra](https://replicate.com/black-forest-labs/flux-1.1-pro-ultra) model

Switching between AI providers is as simple as changing 2 lines of code - your prompt and settings remain unchanged:

```
import { experimental_generateImage as generateImage } from 'ai';import { fireworks } from '@ai-sdk/fireworks';const { image } = await generateImage({  model: fireworks.image('accounts/fireworks/models/SSD-1B'),  prompt: 'A futuristic cityscape at sunset',});
```

![Image 15](https://vercel.com/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2F3xqYSkFgh7avLp6ZgwDYIp%2Fc29db6eaa7d78629c56c7f21106b8405%2Fimage-1737028481453-1.png&w=1920&q=75)

Image generated with Fireworks' [SSD-1B](https://fireworks.ai/models/fireworks/SSD-1B) model

With the `generateImage` function, you have full control of parameters like:

- Control image dimensions with `size` or `aspectRatio`
- Generate multiple images in parallel with `n`
- Access images in both base64 and uint8Array formats
- Control randomness with `seed`

Provider-specific options are also supported through the `providerOptions` parameter:

```
const { image } = await generateImage({  model: replicate.image('black-forest-labs/flux-1.1-pro-ultra'),  prompt: 'A futuristic cityscape at sunset',  size: "16:9",  n: 3,  seed: 0,  providerOptions: {    replicate: { style: 'realistic_image' },  },});
```

The AI SDK supports image generation across multiple providers including [Replicate](https://sdk.vercel.ai/providers/ai-sdk-providers/replicate#image-models), [OpenAI](https://sdk.vercel.ai/providers/ai-sdk-providers/openai#image-models), [Google Vertex AI](https://sdk.vercel.ai/providers/ai-sdk-providers/google-vertex#image-models), and [Fireworks](https://sdk.vercel.ai/providers/ai-sdk-providers/fireworks#image-models).

Check out our [image generation demo](https://ai-sdk-image-generator.vercel.app/) to see how different providers handle the same prompts and explore the capabilities of each model.

## [Stream transformation & smoothing](https://vercel.com/blog/ai-sdk-4-1#stream-transformation-&-smoothing)

AI SDK 4.1 introduces new capabilities for transforming stream output on the server. This enables powerful use cases such as:

- Creating smoother streaming experiences with the built-in [`smoothStream`](https://sdk.vercel.ai/docs/reference/ai-sdk-core/smooth-stream) transform (with custom chunking options such as by character, word, line)
- Filtering content and applying safety guardrails
- Any custom transformation (eg. [uppercase](https://sdk.vercel.ai/docs/ai-sdk-core/generating-text#custom-transformations))

For example, the built-in `smoothStream` function helps create more natural text streaming by smoothing chunky or inconsistent provider responses into a smoother flow:

```
import { smoothStream, streamText } from 'ai';const result = streamText({  model,  prompt,  experimental_transform: smoothStream(),});
```

Multiple transformations can be applied by passing them as an array:

```
const result = streamText({  model,  prompt,  experimental_transform: [firstTransform, secondTransform],});
```

Check out our [stream transformation documentation](https://sdk.vercel.ai/docs/ai-sdk-core/generating-text#stream-transformation) to learn more about configuring chunking patterns, implementing content filtering, and creating your own transformations.

## [Simplified persistence with `useChat`](https://vercel.com/blog/ai-sdk-4-1#simplified-persistence-with-usechat)

We heard your feedback that adding persistence to `useChat` is too complicated. To address this, we've added three key improvements:

- Chat ID can be forwarded from the client to the server
- Response message IDs can be forwarded from the server to the client
- The new `appendResponseMessages` utility unifies messages for simple saving

Check out our [chat persistence guide](https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot-message-persistence) to learn more, or start with our [minimal example](https://github.com/vercel/ai/blob/main/examples/next-openai/app/api/use-chat-persistence/route.ts) if you prefer to dive straight into code.

## [Non-blocking data streaming](https://vercel.com/blog/ai-sdk-4-1#non-blocking-data-streaming)

AI SDK 4.1 introduces powerful new streaming functionality with the [`createDataStreamResponse`](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/create-data-stream-response#createdatastreamresponse) function enabling powerful use cases like streaming retrieval-augmented generation (RAG) context and search results to the client before the LLM’s response begins. Previously, streaming was limited to returning the result of a single LLM call (eg. `streamText().toDataStreamResponse()`). Now, you can create non-blocking data streams that:

- Return immediately and allows you to stream data on-demand
- Provide full control over when and what data is streamed
- Support adding annotations and metadata to messages

Here's an example of using `createDataStreamResponse` to stream custom data alongside LLM output:

```
import { openai } from "@ai-sdk/openai";import { createDataStreamResponse, Message, streamText } from "ai";import { getRelevantContent } from "./get-relevant-content"; // user-definedexport async function POST(req: Request) {  const { messages }: { messages: Message[] } = await req.json();  const lastMessage = messages.pop();  return createDataStreamResponse({    execute: async (dataStream) => {      const relevantContent = await getRelevantContent(lastMessage.content);      for (const content of relevantContent) {        dataStream.writeData({          type: "source",          url: content.url,          title: content.title,        });      }      lastMessage.content =        lastMessage.content +        "\n\nUse the following information to answer the question: " +        relevantContent.join("\n");      const result = streamText({        model: openai("gpt-4o"),        messages: [...messages, lastMessage],        onFinish: async ({}) => {          dataStream.writeMessageAnnotation({ sources: relevantContent });        },      });      result.mergeIntoDataStream(dataStream);    },  });}
```

The streamed data is automatically handled by the [`useChat`](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat) hook on the client, making it simple to access both the message content and any additional streamed data:

```
"use client";import { useChat } from "ai/react";export default function Chat() {  const { messages, data } = useChat();  // Access streamed data  console.log(data);  // Access message annotations  messages.forEach(m => console.log(m.annotations));  return (/* ... */);}
```

To learn more, check out the [streaming custom data documentation](https://sdk.vercel.ai/docs/ai-sdk-ui/streaming-data).

## [Tool-calling improvements](https://vercel.com/blog/ai-sdk-4-1#tool-calling-improvements)

Tools are a core building block of production AI applications - they enable language models to interact with real-world systems and data. However, getting tools to work reliably can be challenging. With AI SDK 4.1, we've invested significantly in making tool calling more robust:

### [Improved context within tool calls](https://vercel.com/blog/ai-sdk-4-1#improved-context-within-tool-calls)

When executing a tool call, the `execute` function now has access to helpful context accessible through a second parameter:

- `toolCallId` for tracking specific executions and adding tool-related annotations
- `messages` array containing full conversation history, including previous tool calls and results
- `abortSignal` for canceling long-running operations and forwarding to fetch calls

Here's an example using these context options:

```
const result = await generateText({  model,  abortSignal,  tools: {    weather: tool({      parameters: z.object({ location: z.string() }),      execute: async ({ location }, { toolCallId, messages, abortSignal }) => {        // Use toolCallId for tracking        data.appendMessageAnnotation({          type: 'tool-status',          toolCallId,          status: 'in-progress',        });        // Forward abort signal        const response = await fetch(          `https://api.weatherapi.com/v1/current.json?q=${location}`,          { signal: abortSignal },        );        return response.json();      },    }),  },});
```

To learn more, check out the [tool-calling documentation](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling#tool-execution-options).

### [Tool call repair](https://vercel.com/blog/ai-sdk-4-1#tool-call-repair)

When tool calls fail, you can now use the [`experimental_toToolCallRepair`](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling#tool-call-repair) function to attempt repairs to:

- Use a model with structured outputs to generate the arguments.
- Send the messages, system prompt, and tool schema to a stronger model to generate the arguments.
- Provide more specific repair instructions based on which tool was called.

```
import { openai } from '@ai-sdk/openai';import { generateObject, generateText, NoSuchToolError, tool } from 'ai';const result = await generateText({  model,  tools,  prompt,  // example approach: use a model with structured outputs for repair.  // (you can use other strategies as well)  experimental_repairToolCall: async ({    toolCall,    tools,    parameterSchema,    error,  }) => {    if (NoSuchToolError.isInstance(error)) {      return null; // do not attempt to fix invalid tool names    }    const tool = tools[toolCall.toolName as keyof typeof tools];    const { object: repairedArgs } = await generateObject({      model: openai('gpt-4o', { structuredOutputs: true }),      schema: tool.parameters,      prompt: [        `The model tried to call the tool "${toolCall.toolName}"` +          ` with the following arguments:`,        JSON.stringify(toolCall.args),        `The tool accepts the following schema:`,        JSON.stringify(parameterSchema(toolCall)),        'Please fix the arguments.',      ].join('\\n'),    });    return { ...toolCall, args: JSON.stringify(repairedArgs) };  },});
```

### [Granular error handling](https://vercel.com/blog/ai-sdk-4-1#granular-error-handling)

To help ship more resilient tool calls, the AI SDK now provides granular error types that make debugging and error handling more precise. Each error type exposes detailed information about what went wrong and includes contextual data to help diagnose and fix issues:

- `NoSuchToolError`: Handles cases where the model attempts to call an undefined tool.
- `InvalidToolArgumentsError`: Catches schema validation failures when tool arguments don't match the expected parameters.
- `ToolExecutionError`: Identifies runtime issues during tool execution.
- `ToolCallRepairError`: Tracks failures during automatic tool call repair attempts.

These specific error types allow you to implement targeted error handling strategies and provide better feedback to users when tool execution fails. To learn more, check out the [error handling documentation](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling#handling-errors).

## [Structured output improvements](https://vercel.com/blog/ai-sdk-4-1#structured-output-improvements)

We've expanded structured output capabilities to enable more dynamic and resilient AI applications:

### [Structured outputs with tools](https://vercel.com/blog/ai-sdk-4-1#structured-outputs-with-tools)

One of our most requested features is now available: the ability to combine structured outputs with tool usage. With the new `experimental_output` option in both `generateText` and `streamText`, you can build sophisticated large-language model (LLM) calls that can both interact with external systems and return predictably structured data.

Here's an example showing how structured outputs and tools work together:

```
import { openai } from '@ai-sdk/openai';import { generateText, tool, Output } from 'ai';import { z } from 'zod';const result = await generateText({  model: openai('gpt-4o', { structuredOutputs: true }),  prompt: "What's the weather like in London and New York?",  maxSteps: 5,  tools: {    getWeather: tool({      parameters: z.object({        city: z.string(),        units: z.enum(['celsius', 'fahrenheit']),      }),      execute: async ({ city, units }) => {        // Fetch weather data      },    }),  },  experimental_output: Output.object({    schema: z.object({      cities: z.array(        z.object({          name: z.string(),          temperature: z.number(),          conditions: z.string(),        }),      ),    }),  }),});
```

Instead of making separate calls to determine which cities to check and then calling weather tools for each one, the model can handle the entire workflow in a single function. This results in more efficient and maintainable code, especially for complex scenarios with unpredictable inputs or multiple potential tool paths. To learn more, check out the [structured outputs with `generateText` and `streamText` documentation](https://sdk.vercel.ai/docs/ai-sdk-core/generating-structured-data#structured-outputs-with-generatetext-and-streamtext).

Currently, structured outputs with tools is only available with OpenAI models.

### [Enhanced error handling](https://vercel.com/blog/ai-sdk-4-1#enhanced-error-handling)

Error handling for structured outputs has been significantly improved in 4.1. Previously, when structure parsing or validation failed, you only received an error – with no access to the underlying response. This meant your only option was to retry the request. With the new [`NoObjectGeneratedError`](https://sdk.vercel.ai/docs/reference/ai-sdk-errors/ai-no-object-generated-error), you now have access to:

- Raw model output for debugging or salvaging partial responses
- Complete request context (response ID, timestamp, model)
- Token usage and cost analytics

Here's how to implement the enhanced error handling:

```
try {  const result = await generateObject({    model,    schema,    prompt,  });} catch (error) {  if (error instanceof NoObjectGeneratedError) {    console.log('Generated text:', error.text);    console.log('Response metadata:', error.response);    console.log('Token usage:', error.usage);    console.log('Error cause:', error.cause);  }}
```

This granular error information makes it easier to diagnose and fix issues with structured output generation, whether they occur during parsing, validation, or model generation phases.

Check out the [structured output error handling documentation](https://sdk.vercel.ai/docs/ai-sdk-core/generating-structured-data#error-handling) to learn more about implementing these patterns.

## [New and updated providers](https://vercel.com/blog/ai-sdk-4-1#new-and-updated-providers)

The AI SDK provider ecosystem continues to grow with new and improved providers:

- [Google Vertex](https://sdk.vercel.ai/providers/ai-sdk-providers/google-vertex) AI 2.0: A complete refresh of the Vertex AI integration that introduces enhanced performance, improved error handling, and search-grounding support.
- [OpenAI](https://sdk.vercel.ai/providers/ai-sdk-providers/openai): Fully revamped support for latest reasoning models.
- [OpenAI Compatible](https://sdk.vercel.ai/providers/openai-compatible-providers): A new dedicated provider for OpenAI-compatible APIs.
- [Replicate](https://sdk.vercel.ai/providers/ai-sdk-providers/replicate): Adds first-party provider for Replicate (image models).
- [Fireworks](https://sdk.vercel.ai/providers/openai-compatible-providers/fireworks): Adds first-party provider for Fireworks (language and image models).
- [Cohere](https://sdk.vercel.ai/providers/ai-sdk-providers/cohere): Adds first-party provider for Cohere (language and embedding models).
- [Together AI](https://sdk.vercel.ai/providers/openai-compatible-providers/togetherai): Adds first-party provider for Together AI (language models).
- [DeepInfra](https://sdk.vercel.ai/providers/ai-sdk-providers/deepinfra): Adds first-party provider for DeepInfra (language models).
- [DeepSeek](https://sdk.vercel.ai/providers/ai-sdk-providers/deepseek): Adds first-party provider for DeepSeek (language models).
- [Cerebras](https://sdk.vercel.ai/providers/ai-sdk-providers/cerebras): Adds first-party provider for Cerebras (language models).

## [**Getting started**](https://vercel.com/blog/ai-sdk-4-1#getting-started)

With powerful new features like image generation, non-blocking data streaming, and improved tool calling, there's never been a better time to start building AI applications with the AI SDK.

- **Start a new AI project**: Ready to build something new? Check out our [**latest guides**](https://sdk.vercel.ai/cookbook)
- **Explore our templates**: Visit our [**Template Gallery**](https://sdk.vercel.ai/docs/introduction#templates) to see the AI SDK in action
- **Join the community**: Share what you're building in our [**GitHub Discussions**](https://github.com/vercel/ai/discussions)

---

Title: AI SDK 4.0 - Vercel

URL Source: https://vercel.com/blog/ai-sdk-4-0

Markdown Content:
Introducing PDF support, computer use, and an xAI Grok provider

The [AI SDK](https://sdk.vercel.ai/) is an open-source toolkit for building AI applications with JavaScript and TypeScript. Its unified provider API allows you to use any language model and enables powerful UI integrations into leading web frameworks such as [Next.js](https://nextjs.org/) and [Svelte](https://svelte.dev/).

Since our 3.4 release, we've seen the community build amazing products with the AI SDK:

- Val Town's Townie is an [AI assistant that helps developers](https://blog.val.town/blog/building-a-code-writing-robot/) turn ideas into deployed TypeScript apps and APIs right from their browser
- Chatbase has [scaled to 500K monthly visitors and $4M ARR](https://vercel.com/blog/how-chatbase-scaled-rapidly-with-vercels-developer-experience-and-ai-sdk), using the AI SDK to power customizable chat agents for customer support and sales
- ChatPRD helps product managers craft Product Requirements Documents (PRDs) and roadmaps with AI, [growing to 20,000 users in just nine months](https://vercel.com/blog/leveraging-vercel-and-the-ai-sdk-to-deliver-a-seamless-ai-powered-experience)

Today, we're announcing the release of AI SDK 4.0. This version introduces several new capabilities including:

- [PDF support for Anthropic and Google Generative AI providers for document analysis](https://vercel.com/blog/ai-sdk-4-0#pdf-support)
- [Computer use support with Anthropic's Claude](<https://vercel.com/blog/ai-sdk-4-0#computer-use-support-(anthropic)>)
- [Continuation support for long text generation](https://vercel.com/blog/ai-sdk-4-0#continuation-support)
- [New xAI Grok provider](https://vercel.com/blog/ai-sdk-4-0#new-xai-grok-provider)
- [Additional provider updates](https://vercel.com/blog/ai-sdk-4-0#additional-provider-updates)
- [Updated AI Chatbot template](https://vercel.com/blog/ai-sdk-4-0#updated-chatbot-template)

Let's explore these new features and improvements.

## [PDF support](https://vercel.com/blog/ai-sdk-4-0#pdf-support)

Supporting PDF documents is essential for AI applications as this format is the standard way people share and store documents. Organizations and individuals have built up large collections of important documents in PDF format—from contracts and research papers to manuals and reports—which means AI systems need to handle PDFs well if they're going to help with analyzing documents, pulling out information, or automating workflows.

AI SDK 4.0 introduces PDF support across multiple providers, including [Anthropic](https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic#pdf-support), [Google Generative AI](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai#file-inputs), and [Google Vertex AI](https://sdk.vercel.ai/providers/ai-sdk-providers/google-vertex#file-inputs). With PDF support, you can:

- Extract text and information from PDF documents
- Analyze and summarize PDF content
- Answer questions based on PDF content

To send a PDF to any compatible model, you can pass PDF files as part of the message content using the `file` type. Here’s an example with Anthropic’s Claude Sonnet 3.5 model:

```
import { generateText } from 'ai';import { anthropic } from '@ai-sdk/anthropic';const result = await generateText({  model: anthropic('claude-3-5-sonnet-20241022'),  messages: [    {      role: 'user',      content: [        {          type: 'text',          text: 'What is an embedding model according to this document?',        },        {          type: 'file',          data: fs.readFileSync('./data/ai.pdf'),          mimeType: 'application/pdf',        },      ],    },  ],});
```

Thanks to the AI SDK's unified API, to use this functionality with Google or Vertex AI, all you need to change is the model string in the code above.

The code example demonstrates how PDFs integrate seamlessly into your LLM calls. They're treated as just another message content type, requiring no special handling beyond including them as part of the message.

Check out our [quiz generator template](https://ai-sdk-preview-pdf-support.vercel.app/) to see PDF support in action. Using `useObject` and Google's Gemini Pro 1.5 model, it generates an interactive multiple choice quiz based on the contents of a PDF that you upload.

## [**Computer use support (Anthropic)**](<https://vercel.com/blog/ai-sdk-4-0#computer-use-support-(anthropic)>)

Enabling AI to interact with apps and interfaces naturally, instead of using special tools, unlocks new automation and assistance opportunities.

AI SDK 4.0 introduces [computer use support for the latest Claude Sonnet 3.5 model](https://www.anthropic.com/news/3-5-models-and-computer-use), allowing you to build applications that can:

- Control mouse movements and clicks
- Input keyboard commands
- Capture and analyze screenshots
- Execute terminal commands
- Manipulate text files

Anthropic provides three predefined tools designed to work with the latest Claude 3.5 Sonnet model: the [Computer Tool](https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic#computer-tool) for basic system control (mouse, keyboard, and screenshots), the [Text Editor Tool](https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic#text-editor-tool) for file operations, and the [Bash Tool](https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic#bash-tool) for terminal commands. These tools are carefully designed so that Claude knows exactly how to use them.

While Anthropic defines the tool interfaces, you'll need to implement the underlying `execute` function for each tool, defining how your application should handle actions like moving the mouse, capturing screenshots, or running terminal commands on your specific system.

Here's an example using the computer tool with `generateText`:

```
import { generateText } from 'ai';import { anthropic } from '@ai-sdk/anthropic';import { executeComputerAction, getScreenshot } from '@/lib/ai'; // user-definedconst computerTool = anthropic.tools.computer_20241022({  displayWidthPx: 1920,  displayHeightPx: 1080,  execute: async ({ action, coordinate, text }) => {    switch (action) {      case 'screenshot': {        return {          type: 'image',          data: getScreenshot(),        };      }      default: {        return executeComputerAction(action, coordinate, text);      }    }  },  experimental_toToolResultContent: (result) => {	  return typeof result === 'string'	    ? [{ type: 'text', text: result }]	    : [{ type: 'image', data: result.data, mimeType: 'image/png' }];  },});const result = await generateText({  model: anthropic('claude-3-5-sonnet-20241022'),  prompt: 'Move the cursor to the center of the screen and take a screenshot',  tools: { computer: computerTool },});
```

You can combine these tools with the AI SDK's [`maxSteps`](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling#multi-step-calls) feature to enable more sophisticated workflows. By setting a `maxSteps` value, the model can make multiple consecutive tool calls without user intervention, continuing until it determines the task is complete. This is particularly powerful for complex automation tasks that require a sequence of different operations:

```
const result = await generateText({  model: anthropic('claude-3-5-sonnet-20241022'),  prompt: 'Summarize the AI news from this week.',  tools: { computer: computerTool, textEditor: textEditorTool, bash: bashTool },  maxSteps: 10,});
```

Note that Anthropic computer use is currently in beta, and it's recommended to [implement appropriate safety measures](https://sdk.vercel.ai/docs/guides/computer-use#security-measures) such as using virtual machines and limiting access to sensitive data when building applications with this functionality. To learn more, check out our [computer use guide](https://sdk.vercel.ai/docs/guides/computer-use).

## [Continuation support](https://vercel.com/blog/ai-sdk-4-0#continuation-support)

Many AI applications—from writing long-form content to generating code—require outputs that exceed the generation limits of language models. While these models can understand large amounts of content in their context window, they're typically limited in how much they can generate in a single response.

To address this common challenge, AI SDK 4.0 introduces [continuation support](https://sdk.vercel.ai/docs/ai-sdk-core/generating-text#generating-long-text), which detects when a generation is incomplete (i.e. when the finish reason is “length”) and continues the response across multiple steps, combining them into a single unified output. With continuation support, you can:

- Generate text beyond standard output limits
- Maintain coherence across multiple generations
- Automatically handle word boundaries for clean output
- Track combined token usage across steps

This feature works across all providers and can be used with both [`generateText`](https://sdk.vercel.ai/docs/ai-sdk-core/generating-text#generatetext) and [`streamText`](https://sdk.vercel.ai/docs/ai-sdk-core/generating-text#streamtext) by enabling the `experimental_continueSteps` setting. Here's an example of generating a long-form historical text:

```
import { generateText } from 'ai';import { openai } from '@ai-sdk/openai';const result = await generateText({  model: openai('gpt-4o'),  maxSteps: 5,  experimental_continueSteps: true,  prompt:    'Write a book about Roman history, ' +    'from the founding of the city of Rome ' +    'to the fall of the Western Roman Empire. ' +    'Each chapter MUST HAVE at least 1000 words.',});
```

When using continuation support with `streamText`, the SDK ensures clean word boundaries by only streaming complete words. Both `generateText` and `streamText` may trim trailing tokens from some calls to prevent whitespace issues.

## [New xAI Grok provider](https://vercel.com/blog/ai-sdk-4-0#new-xai-grok-provider)

The AI SDK now supports [x.AI](https://x.ai/) through a [new official provider](https://sdk.vercel.ai/providers/ai-sdk-providers/xai). To use the provider, install the package:

```
pnpm install ai @ai-sdk/xai
```

You can then use the provider with all AI SDK Core methods. For example, here's how you can use it with `generateText`:

```
import { xai } from '@ai-sdk/xai';import { generateText } from 'ai';const { text } = await generateText({  model: xai('grok-beta'),  prompt: 'Write a vegetarian lasagna recipe for 4 people.',});
```

For more information, please see the [AI SDK xAI provider documentation](https://sdk.vercel.ai/providers/ai-sdk-providers/xai).

## [Additional provider updates](https://vercel.com/blog/ai-sdk-4-0#additional-provider-updates)

We've expanded our provider support to offer more options and improve performance across the board:

- [Cohere](https://sdk.vercel.ai/providers/ai-sdk-providers/cohere): v2 support and added tool calling capabilities, expanding supported functionality
- [OpenAI](https://sdk.vercel.ai/providers/ai-sdk-providers/openai): [Predicted output support](https://sdk.vercel.ai/providers/ai-sdk-providers/openai#predicted-outputs), enabling more accurate and context-aware completions. Added [prompt caching support](https://sdk.vercel.ai/providers/ai-sdk-providers/openai#prompt-caching) for improved performance and efficiency
- [Google Generative AI](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai) & [Vertex AI](https://sdk.vercel.ai/providers/ai-sdk-providers/google-vertex): Support for [file inputs](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai#file-inputs), fine-tuned models, schemas, tool choice, and frequency penalty. Added [text embedding support to Vertex AI](https://sdk.vercel.ai/providers/ai-sdk-providers/google-vertex#embedding-models)
- [Amazon Bedrock](https://sdk.vercel.ai/providers/ai-sdk-providers/amazon-bedrock): Introduces support for [Amazon Titan embedding models](https://sdk.vercel.ai/providers/ai-sdk-providers/amazon-bedrock#embedding-models)
- [Groq](https://sdk.vercel.ai/providers/ai-sdk-providers/groq): Adds first-party Groq provider, replacing previous OpenAI-compatible provider
- [xAI Grok](https://sdk.vercel.ai/providers/ai-sdk-providers/xai): Adds first-party xAI Grok provider, replacing previous OpenAI-compatible provider
- [LM Studio](https://sdk.vercel.ai/providers/openai-compatible-providers/lmstudio), [Baseten](https://sdk.vercel.ai/providers/openai-compatible-providers/baseten), [Together AI](https://sdk.vercel.ai/providers/openai-compatible-providers/togetherai): Adds OpenAI-compatible providers

## [Updated chatbot template](https://vercel.com/blog/ai-sdk-4-0#updated-chatbot-template)

The [Next.js AI Chatbot template](https://chat.vercel.ai/) has been updated, incorporating everything we've learned from building [v0](https://v0.dev/chat) and the latest framework advances. Built with [Next.js 15](https://nextjs.org/blog/next-15), React 19, and [Auth.js 5](https://authjs.dev/), this new version represents the most comprehensive starting point for production-grade AI applications.

![Image 11](https://vercel.com/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2F3VUtX3HkcC4W5NRb6T1lnB%2Fdb61dad23a3a53d1e0425a029c5c5b6f%2FScreenshot_2024-11-05_at_8.04.13_PM.png&w=1920&q=75)![Image 12](https://vercel.com/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fcontentful%2Fimage%2Fe5382hct74si%2Fof6pHepNv70icp29mfQS6%2Fd5224de941da931f8ad9f56c8091a8fe%2FCleanShot_2024-11-07_at_16.20.34_2x.png&w=1920&q=75)

The template ships with production-ready features, including a redesigned UI with model switching, persistent PostgreSQL storage, and [much more](https://github.com/vercel/ai-chatbot?tab=readme-ov-file#features). It showcases powerful patterns for generative UI and newer variations of the chat interface with interactive workspaces (like [v0 blocks](https://v0.dev/docs#blocks)) that allow you to integrate industry specific workflows and tools to design hybrid AI-user collaborative experiences.

[Try the AI Chatbot demo](https://chat.vercel.ai/) to see these features in action or [deploy your own instance](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot&env=AUTH_SECRET,OPENAI_API_KEY&envDescription=Learn%20more%20about%20how%20to%20get%20the%20API%20Keys%20for%20the%20application&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot%2Fblob%2Fmain%2F.env.example&demo-title=AI%20Chatbot&demo-description=An%20Open-Source%20AI%20Chatbot%20Template%20Built%20With%20Next.js%20and%20the%20AI%20SDK%20by%20Vercel.&demo-url=https%3A%2F%2Fchat.vercel.ai&stores=%5B%7B%22type%22:%22postgres%22%7D,%7B%22type%22:%22blob%22%7D%5D) to start building sophisticated AI applications with battle-tested patterns and best practices.

## [Migrating to AI SDK 4.0](https://vercel.com/blog/ai-sdk-4-0#migrating-to-ai-sdk-4.0)

AI SDK 4.0 includes breaking changes that remove deprecated APIs. We've made the migration process easier with automated migration tools. You can run our automated codemods to handle the bulk of the changes.

For a detailed overview of all changes and manual steps that might be needed, refer to our [AI SDK 4.0 migration guide](https://sdk.vercel.ai/docs/migration-guides/migration-guide-4-0). The guide includes step-by-step instructions and examples to ensure a smooth update.

## [**Getting started**](https://vercel.com/blog/ai-sdk-4-0#getting-started)

With new features like PDF, computer use, and the new xAI Grok provider, there's never been a better time to start building AI applications with the AI SDK.

- **Start a new AI project**: Ready to build something new? Check out our [**latest guides**](https://sdk.vercel.ai/docs/guides)
- **Explore our templates**: Visit our [**Template Gallery**](https://sdk.vercel.ai/docs/introduction#templates) to see the AI SDK in action
- **Join the community**: Share what you're building in our [**GitHub Discussions**](https://github.com/vercel/ai/discussions)
