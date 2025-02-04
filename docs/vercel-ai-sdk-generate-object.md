Title: generateObject

URL Source: https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-object

Markdown Content:
[AI SDK Core](https://sdk.vercel.ai/docs/ai-sdk-core)generateObject

Generates a typed, structured object for a given prompt and schema using a language model.

It can be used to force the language model to return structured data, e.g. for information extraction, synthetic data generation, or classification tasks.

#### [Example: generate an object using a schema](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-object#example-generate-an-object-using-a-schema)

```
import { openai } from '@ai-sdk/openai';import { generateObject } from 'ai';import { z } from 'zod';const { object } = await generateObject({  model: openai('gpt-4-turbo'),  schema: z.object({    recipe: z.object({      name: z.string(),      ingredients: z.array(z.string()),      steps: z.array(z.string()),    }),  }),  prompt: 'Generate a lasagna recipe.',});console.log(JSON.stringify(object, null, 2));
```

#### [Example: generate an array using a schema](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-object#example-generate-an-array-using-a-schema)

For arrays, you specify the schema of the array items.

```
import { openai } from '@ai-sdk/openai';import { generateObject } from 'ai';import { z } from 'zod';const { object } = await generateObject({  model: openai('gpt-4-turbo'),  output: 'array',  schema: z.object({    name: z.string(),    class: z      .string()      .describe('Character class, e.g. warrior, mage, or thief.'),    description: z.string(),  }),  prompt: 'Generate 3 hero descriptions for a fantasy role playing game.',});
```

#### [Example: generate an enum](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-object#example-generate-an-enum)

When you want to generate a specific enum value, you can set the output strategy to `enum` and provide the list of possible values in the `enum` parameter.

```
import { generateObject } from 'ai';const { object } = await generateObject({  model: yourModel,  output: 'enum',  enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],  prompt:    'Classify the genre of this movie plot: ' +    '"A group of astronauts travel through a wormhole in search of a ' +    'new habitable planet for humanity."',});
```

#### [Example: generate JSON without a schema](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-object#example-generate-json-without-a-schema)

```
import { openai } from '@ai-sdk/openai';import { generateObject } from 'ai';const { object } = await generateObject({  model: openai('gpt-4-turbo'),  output: 'no-schema',  prompt: 'Generate a lasagna recipe.',});
```

To see `generateObject` in action, check out the [additional examples](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-object#more-examples).

## [Import](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-object#import)

import { generateObject } from "ai"

## [API Signature](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-object#api-signature)

### [Parameters](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-object#parameters)

The language model to use. Example: openai('gpt-4-turbo')

### output:

'object' | 'array' | 'enum' | 'no-schema' | undefined

The type of output to generate. Defaults to 'object'.

### mode:

'auto' | 'json' | 'tool'

The mode to use for object generation. Not every model supports all modes. Defaults to 'auto' for 'object' output and to 'json' for 'no-schema' output. Must be 'json' for 'no-schema' output.

### schema:

Zod Schema | JSON Schema

The schema that describes the shape of the object to generate. It is sent to the model to generate the object and used to validate the output. You can either pass in a Zod schema or a JSON schema (using the \`jsonSchema\` function). In 'array' mode, the schema is used to describe an array element. Not available with 'no-schema' or 'enum' output.

### schemaName:

string | undefined

Optional name of the output that should be generated. Used by some providers for additional LLM guidance, e.g. via tool or schema name. Not available with 'no-schema' or 'enum' output.

### schemaDescription:

string | undefined

Optional description of the output that should be generated. Used by some providers for additional LLM guidance, e.g. via tool or schema name. Not available with 'no-schema' or 'enum' output.

List of possible values to generate. Only available with 'enum' output.

The system prompt to use that specifies the behavior of the model.

The input prompt to generate the text from.

### messages:

Array<CoreSystemMessage | CoreUserMessage | CoreAssistantMessage | CoreToolMessage\> | Array<UIMessage\>

A list of messages that represent a conversation. Automatically converts UI messages from the useChat hook.

CoreSystemMessage

The role for the system message.

The content of the message.

CoreUserMessage

The role for the user message.

### content:

string | Array<TextPart | ImagePart | FilePart\>

The content of the message.

TextPart

The type of the message part.

The text content of the message part.

ImagePart

The type of the message part.

### image:

string | Uint8Array | Buffer | ArrayBuffer | URL

The image content of the message part. String are either base64 encoded content, base64 data URLs, or http(s) URLs.

The mime type of the image. Optional.

FilePart

The type of the message part.

### data:

string | Uint8Array | Buffer | ArrayBuffer | URL

The file content of the message part. String are either base64 encoded content, base64 data URLs, or http(s) URLs.

The mime type of the file.

CoreAssistantMessage

The role for the assistant message.

### content:

string | Array<TextPart | ToolCallPart\>

The content of the message.

TextPart

The type of the message part.

The text content of the message part.

ToolCallPart

The type of the message part.

The name of the tool, which typically would be the name of the function.

### args:

object based on schema

Parameters generated by the model to be used by the tool.

CoreToolMessage

### content:

Array<ToolResultPart\>

The content of the message.

ToolResultPart

The type of the message part.

The id of the tool call the result corresponds to.

The name of the tool the result corresponds to.

The result returned by the tool after execution.

Whether the result is an error or an error message.

Maximum number of tokens to generate.

Temperature setting. The value is passed through to the provider. The range depends on the provider and model. It is recommended to set either \`temperature\` or \`topP\`, but not both.

Nucleus sampling. The value is passed through to the provider. The range depends on the provider and model. It is recommended to set either \`temperature\` or \`topP\`, but not both.

Only sample from the top K options for each subsequent token. Used to remove "long tail" low probability responses. Recommended for advanced use cases only. You usually only need to use temperature.

Presence penalty setting. It affects the likelihood of the model to repeat information that is already in the prompt. The value is passed through to the provider. The range depends on the provider and model.

Frequency penalty setting. It affects the likelihood of the model to repeatedly use the same words or phrases. The value is passed through to the provider. The range depends on the provider and model.

The seed (integer) to use for random sampling. If set and supported by the model, calls will generate deterministic results.

Maximum number of retries. Set to 0 to disable retries. Default: 2.

An optional abort signal that can be used to cancel the call.

### experimental_telemetry?:

TelemetrySettings

Telemetry configuration. Experimental feature.

TelemetrySettings

Enable or disable telemetry. Disabled by default while experimental.

Enable or disable input recording. Enabled by default.

Enable or disable output recording. Enabled by default.

Identifier for this function. Used to group telemetry data by function.

### [Returns](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-object#returns)

### object:

based on the schema

The generated object, validated by the schema (if it supports validation).

### finishReason:

'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown'

The reason the model finished generating the text.

### usage:

CompletionTokenUsage

The token usage of the generated text.

CompletionTokenUsage

The total number of tokens in the prompt.

The total number of tokens in the completion.

The total number of tokens generated.

Request metadata.

RequestMetadata

Raw request HTTP body that was sent to the provider API as a string (JSON should be stringified).

### response?:

ResponseMetadata

Response metadata.

### warnings:

Warning\[\] | undefined

Warnings from the model provider (e.g. unsupported settings).

### toJsonResponse:

(init?: ResponseInit) =\> Response

Converts the object to a JSON response. The response will have a status code of 200 and a content type of \`application/json; charset=utf-8\`.

## [More Examples](https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-object#more-examples)
