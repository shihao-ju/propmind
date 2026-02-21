import Anthropic from '@anthropic-ai/sdk'
import type { LLMProvider } from './types'

export function createAnthropicProvider(): LLMProvider {
  return {
    client: new Anthropic(),
    model: 'claude-sonnet-4-6',
    name: 'anthropic',
  }
}
