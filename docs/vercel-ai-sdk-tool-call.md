Title: Chatbot Tool Usage

URL Source: https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot-tool-usage

Markdown Content:
[AI SDK UI](https://sdk.vercel.ai/docs/ai-sdk-ui)Chatbot Tool Usage

With [`useChat`](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat) and [`streamText`](https://sdk.vercel.ai/docs/reference/ai-sdk-core/stream-text), you can use tools in your chatbot application. The AI SDK supports three types of tools in this context:

1.  Automatically executed server-side tools
2.  Automatically executed client-side tools
3.  Tools that require user interaction, such as confirmation dialogs

The flow is as follows:

1.  The user enters a message in the chat UI.
2.  The message is sent to the API route.
3.  In your server side route, the language model generates tool calls during the `streamText` call.
4.  All tool calls are forwarded to the client.
5.  Server-side tools are executed using their `execute` method and their results are forwarded to the client.
6.  Client-side tools that should be automatically executed are handled with the `onToolCall` callback. You can return the tool result from the callback.
7.  Client-side tool that require user interactions can be displayed in the UI. The tool calls and results are available in the `toolInvocations` property of the last assistant message.
8.  When the user interaction is done, `addToolResult` can be used to add the tool result to the chat.
9.  When there are tool calls in the last assistant message and all tool results are available, the client sends the updated messages back to the server. This triggers another iteration of this flow.

The tool call and tool executions are integrated into the assistant message as `toolInvocations`. A tool invocation is at first a tool call, and then it becomes a tool result when the tool is executed. The tool result contains all information about the tool call as well as the result of the tool execution.

In order to automatically send another request to the server when all tool calls are server-side, you need to set [`maxSteps`](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat#max-steps) to a value greater than 1 in the `useChat` options. It is disabled by default for backward compatibility.

## [Example](https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot-tool-usage#example)

In this example, we'll use three tools:

- `getWeatherInformation`: An automatically executed server-side tool that returns the weather in a given city.
- `askForConfirmation`: A user-interaction client-side tool that asks the user for confirmation.
- `getLocation`: An automatically executed client-side tool that returns a random city.

### [API route](https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot-tool-usage#api-route)

```
import { openai } from '@ai-sdk/openai';import { streamText } from 'ai';import { z } from 'zod';// Allow streaming responses up to 30 secondsexport const maxDuration = 30;export async function POST(req: Request) {  const { messages } = await req.json();  const result = streamText({    model: openai('gpt-4-turbo'),    messages,    tools: {      // server-side tool with execute function:      getWeatherInformation: {        description: 'show the weather in a given city to the user',        parameters: z.object({ city: z.string() }),        execute: async ({}: { city: string }) => {          const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];          return weatherOptions[            Math.floor(Math.random() * weatherOptions.length)          ];        },      },      // client-side tool that starts user interaction:      askForConfirmation: {        description: 'Ask the user for confirmation.',        parameters: z.object({          message: z.string().describe('The message to ask for confirmation.'),        }),      },      // client-side tool that is automatically executed on the client:      getLocation: {        description:          'Get the user location. Always ask for confirmation before using this tool.',        parameters: z.object({}),      },    },  });  return result.toDataStreamResponse();}
```

### [Client-side page](https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot-tool-usage#client-side-page)

The client-side page uses the `useChat` hook to create a chatbot application with real-time message streaming. Tool invocations are displayed in the chat UI.

There are three things worth mentioning:

1.  The [`onToolCall`](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat#on-tool-call) callback is used to handle client-side tools that should be automatically executed. In this example, the `getLocation` tool is a client-side tool that returns a random city.
2.  The `toolInvocations` property of the last assistant message contains all tool calls and results. The client-side tool `askForConfirmation` is displayed in the UI. It asks the user for confirmation and displays the result once the user confirms or denies the execution. The result is added to the chat using `addToolResult`.
3.  The [`maxSteps`](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat#max-steps) option is set to 5. This enables several tool use iterations between the client and the server.

```
'use client';import { ToolInvocation } from 'ai';import { Message, useChat } from 'ai/react';export default function Chat() {  const { messages, input, handleInputChange, handleSubmit, addToolResult } =    useChat({      maxSteps: 5,      // run client-side tools that are automatically executed:      async onToolCall({ toolCall }) {        if (toolCall.toolName === 'getLocation') {          const cities = [            'New York',            'Los Angeles',            'Chicago',            'San Francisco',          ];          return cities[Math.floor(Math.random() * cities.length)];        }      },    });  return (    <>      {messages?.map((m: Message) => (        <div key={m.id}>          <strong>{m.role}:</strong>          {m.content}          {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {            const toolCallId = toolInvocation.toolCallId;            const addResult = (result: string) =>              addToolResult({ toolCallId, result });            // render confirmation tool (client-side tool with user interaction)            if (toolInvocation.toolName === 'askForConfirmation') {              return (                <div key={toolCallId}>                  {toolInvocation.args.message}                  <div>                    {'result' in toolInvocation ? (                      <b>{toolInvocation.result}</b>                    ) : (                      <>                        <button onClick={() => addResult('Yes')}>Yes</button>                        <button onClick={() => addResult('No')}>No</button>                      </>                    )}                  </div>                </div>              );            }            // other tools:            return 'result' in toolInvocation ? (              <div key={toolCallId}>                Tool call {`${toolInvocation.toolName}: `}                {toolInvocation.result}              </div>            ) : (              <div key={toolCallId}>Calling {toolInvocation.toolName}...</div>            );          })}          <br />        </div>      ))}      <form onSubmit={handleSubmit}>        <input value={input} onChange={handleInputChange} />      </form>    </>  );}
```

You can stream tool calls while they are being generated by enabling the `toolCallStreaming` option in `streamText`.

```
export async function POST(req: Request) {  // ...  const result = streamText({    toolCallStreaming: true,    // ...  });  return result.toDataStreamResponse();}
```

When the flag is enabled, partial tool calls will be streamed as part of the data stream. They are available through the `useChat` hook. The `toolInvocations` property of assistant messages will also contain partial tool calls. You can use the `state` property of the tool invocation to render the correct UI.

```
export default function Chat() {  // ...  return (    <>      {messages?.map((m: Message) => (        <div key={m.id}>          {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {            switch (toolInvocation.state) {              case 'partial-call':                return <>render partial tool call</>;              case 'call':                return <>render full tool call</>;              case 'result':                return <>render tool result</>;            }          })}        </div>      ))}    </>  );}
```

## [Server-side Multi-Step Calls](https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot-tool-usage#server-side-multi-step-calls)

You can also use multi-step calls on the server-side with `streamText`. This works when all invoked tools have an `execute` function on the server side.

```
import { openai } from '@ai-sdk/openai';import { streamText } from 'ai';import { z } from 'zod';export async function POST(req: Request) {  const { messages } = await req.json();  const result = streamText({    model: openai('gpt-4-turbo'),    messages,    tools: {      getWeatherInformation: {        description: 'show the weather in a given city to the user',        parameters: z.object({ city: z.string() }),        // tool has execute function:        execute: async ({}: { city: string }) => {          const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];          return weatherOptions[            Math.floor(Math.random() * weatherOptions.length)          ];        },      },    },    maxSteps: 5,  });  return result.toDataStreamResponse();}
```

## [Errors](https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot-tool-usage#errors)

Language models can make errors when calling tools. By default, these errors are masked for security reasons, and show up as "An error occurred" in the UI.

To surface the errors, you can use the `getErrorMessage` function when calling `toDataStreamResponse`.

```
export function errorHandler(error: unknown) {  if (error == null) {    return 'unknown error';  }  if (typeof error === 'string') {    return error;  }  if (error instanceof Error) {    return error.message;  }  return JSON.stringify(error);}
```

```
const result = streamText({  // ...});return result.toDataStreamResponse({  getErrorMessage: errorHandler,});
```

In case you are using `createDataStreamResponse`, you can use the `onError` function when calling `toDataStreamResponse`:

```
const response = createDataStreamResponse({  // ...  async execute(dataStream) {    // ...  },  onError: error => `Custom error: ${error.message}`,});
```
