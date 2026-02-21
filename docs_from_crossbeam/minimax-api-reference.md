# MiniMax API Reference (Anthropic-Compatible)

MiniMax offers an Anthropic-compatible API, allowing us to use the same `@anthropic-ai/sdk` with a different base URL.

## Connection Details

- **Base URL:** `https://api.minimax.io/anthropic`
- **Auth:** Pass MiniMax API key as the `apiKey` in the Anthropic client constructor
- **SDK:** `@anthropic-ai/sdk` (same as Claude — no extra dependency)

## Supported Models

| Model | Speed | Context |
|-------|-------|---------|
| `MiniMax-M2.5` | ~60 tok/s | 204,800 tokens |
| `MiniMax-M2.5-highspeed` | ~100 tok/s | 204,800 tokens |
| `MiniMax-M2.1` | ~60 tok/s | 204,800 tokens |
| `MiniMax-M2.1-highspeed` | ~100 tok/s | 204,800 tokens |
| `MiniMax-M2` | Advanced reasoning | 204,800 tokens |

**Default for PropMind:** `MiniMax-M2.5`

## Node.js Usage

```typescript
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.MINIMAX_API_KEY,
  baseURL: 'https://api.minimax.io/anthropic',
})

const response = await client.messages.create({
  model: 'MiniMax-M2.5',
  max_tokens: 1024,
  system: 'You are a helpful assistant.',
  tools: [
    {
      name: 'get_weather',
      description: 'Get current weather',
      input_schema: {
        type: 'object',
        properties: { city: { type: 'string' } },
        required: ['city'],
      },
    },
  ],
  messages: [{ role: 'user', content: 'What is the weather in Tokyo?' }],
})
```

## Supported Features

- Text messages and multi-turn conversation
- Tool use / tool results (same format as Anthropic)
- Streaming responses (`stream: true`)
- System prompts
- Temperature (0.0–1.0], top_p

## NOT Supported

- Image and document inputs
- `top_k`, `stop_sequences`, `service_tier`, `mcp_servers`

## Critical Pattern: Multi-Turn Tool Calling

When feeding tool results back, you MUST append the complete model response (all content blocks) to conversation history. This maintains the reasoning chain continuity.

```typescript
conversationMessages = [
  ...conversationMessages,
  { role: 'assistant', content: response.content }, // full content array
  {
    role: 'user',
    content: [{ type: 'tool_result', tool_use_id: toolBlock.id, content: resultStr }],
  },
]
```

This is identical to how we already handle Anthropic tool loops in `/api/chat/route.ts`.

## Reference

- Docs: https://platform.minimax.io/docs/api-reference/text-anthropic-api
