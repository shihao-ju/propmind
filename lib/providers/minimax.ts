import Anthropic from '@anthropic-ai/sdk'
import type { LLMProvider } from './types'

export function createMiniMaxProvider(): LLMProvider {
  const apiKey = process.env.MINIMAX_API_KEY
  if (!apiKey) {
    throw new Error('MINIMAX_API_KEY environment variable is required')
  }

  return {
    client: new Anthropic({
      apiKey,
      baseURL: 'https://api.minimax.io/anthropic',
    }),
    model: 'MiniMax-M2.5-highspeed',
    name: 'minimax',
  }
}
