/**
 * Base LLM Provider Interface
 * All provider implementations must implement this interface
 */

import type { PromptConfig, LLMResponse, ProviderConfig } from '@/types/llm';

export interface ILLMProvider {
  /**
   * Generate a response from the LLM
   */
  generateResponse(prompt: PromptConfig, config: ProviderConfig): Promise<LLMResponse>;

  /**
   * Test the connection with the provider
   */
  testConnection(config: ProviderConfig): Promise<boolean>;

  /**
   * Estimate tokens for a given text
   */
  estimateTokens(text: string): number;

  /**
   * Get the provider name
   */
  getProviderName(): string;
}

/**
 * Base class for LLM providers with common functionality
 */
export abstract class BaseLLMProvider implements ILLMProvider {
  abstract generateResponse(prompt: PromptConfig, config: ProviderConfig): Promise<LLMResponse>;
  abstract testConnection(config: ProviderConfig): Promise<boolean>;
  abstract getProviderName(): string;

  /**
   * Rough token estimation (4 characters ≈ 1 token)
   * This is a conservative estimate that works across most models
   */
  estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Exponential backoff retry logic
   */
  protected async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;

        // Don't retry on auth errors or invalid requests
        if (error.status === 401 || error.status === 400) {
          throw error;
        }

        // Don't retry on last attempt
        if (i === maxRetries - 1) {
          break;
        }

        // Exponential backoff: 1s, 2s, 4s
        const delay = initialDelay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  /**
   * Validate API key format (basic check)
   */
  protected validateApiKey(apiKey: string, prefix?: string): void {
    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error('API key is required');
    }

    if (prefix && !apiKey.startsWith(prefix)) {
      throw new Error(`Invalid API key format. Expected key starting with "${prefix}"`);
    }
  }

  /**
   * Handle common HTTP errors
   */
  protected handleHTTPError(status: number, message: string): Error {
    switch (status) {
      case 401:
        return new Error('Invalid API key. Please check your Settings.');
      case 429:
        return new Error('Rate limit exceeded. Please try again in a few moments.');
      case 500:
      case 502:
      case 503:
        return new Error('Provider service unavailable. Please try again later.');
      default:
        return new Error(message || `Request failed with status ${status}`);
    }
  }
}
