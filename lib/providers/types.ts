import Anthropic from '@anthropic-ai/sdk'

export interface LLMProvider {
  client: Anthropic
  model: string
  name: string
}
