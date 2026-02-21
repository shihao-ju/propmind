import type { LLMProvider } from './types'
import { createAnthropicProvider } from './anthropic'
import { createMiniMaxProvider } from './minimax'

export type { LLMProvider }

const PROVIDERS: Record<string, () => LLMProvider> = {
  anthropic: createAnthropicProvider,
  minimax: createMiniMaxProvider,
}

/**
 * Get an LLM provider by name. Falls back to LLM_PROVIDER env var, then 'anthropic'.
 */
export function getProvider(name?: string): LLMProvider {
  const providerName = name || process.env.LLM_PROVIDER || 'anthropic'
  const factory = PROVIDERS[providerName]
  if (!factory) {
    throw new Error(
      `Unknown LLM provider: "${providerName}". Available: ${Object.keys(PROVIDERS).join(', ')}`
    )
  }
  return factory()
}
