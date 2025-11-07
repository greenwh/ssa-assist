/**
 * LLM Service Type Definitions
 */

export type LLMProviderType = 'gemini' | 'openai' | 'claude' | 'xai';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface PromptConfig {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  context?: Record<string, any>;
}

export interface LLMResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
  provider: LLMProviderType;
}

export interface LLMError {
  type: 'auth' | 'network' | 'rate_limit' | 'token_limit' | 'invalid_request' | 'unknown';
  message: string;
  details?: any;
  retryable: boolean;
}

export interface GenerationRequest {
  ssaQuestion: string;
  userInputs: Record<string, any>;
  blueBookListings: string[];
  functionalInputs: any;
}

export interface CostEstimate {
  estimatedTokens: number;
  estimatedCost: number;
  currency: 'USD';
  provider: LLMProviderType;
}

// Provider-specific configuration
export interface ProviderConfig {
  apiKey: string;
  model: string;
  baseURL?: string;
  timeout?: number;
}

// Cost per 1M tokens (as of Jan 2025)
export const PRICING: Record<LLMProviderType, { input: number; output: number }> = {
  gemini: { input: 0.075, output: 0.30 }, // gemini-2.0-flash-exp
  openai: { input: 0.15, output: 0.60 },  // gpt-4o-mini
  claude: { input: 3.0, output: 15.0 },   // claude-sonnet-4
  xai: { input: 5.0, output: 15.0 },      // grok-beta (estimated)
};
