/**
 * Anthropic Claude Provider
 * Implements the Anthropic Messages API
 */

import { BaseLLMProvider } from '../LLMProvider';
import type { PromptConfig, LLMResponse, ProviderConfig } from '@/types/llm';

export class ClaudeProvider extends BaseLLMProvider {
  private readonly baseURL = 'https://api.anthropic.com/v1';
  private readonly apiVersion = '2023-06-01';

  getProviderName(): string {
    return 'claude';
  }

  async generateResponse(prompt: PromptConfig, config: ProviderConfig): Promise<LLMResponse> {
    this.validateApiKey(config.apiKey, 'sk-ant-');

    const url = `${config.baseURL || this.baseURL}/messages`;

    const requestBody = {
      model: config.model,
      max_tokens: prompt.maxTokens ?? 2048,
      temperature: prompt.temperature ?? 0.7,
      system: prompt.systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt.userPrompt,
        },
      ],
    };

    return this.retryWithBackoff(async () => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': this.apiVersion,
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(config.timeout ?? 60000),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
        throw this.handleHTTPError(
          response.status,
          error.error?.message || 'Claude API request failed'
        );
      }

      const data = await response.json();

      if (!data.content?.[0]?.text) {
        throw new Error('Invalid response from Claude API');
      }

      return {
        text: data.content[0].text,
        usage: data.usage
          ? {
              promptTokens: data.usage.input_tokens || 0,
              completionTokens: data.usage.output_tokens || 0,
              totalTokens: (data.usage.input_tokens || 0) + (data.usage.output_tokens || 0),
            }
          : undefined,
        model: data.model,
        provider: 'claude',
      };
    });
  }

  async testConnection(config: ProviderConfig): Promise<boolean> {
    try {
      this.validateApiKey(config.apiKey, 'sk-ant-');

      // Claude doesn't have a simple endpoint to test connection
      // We'll make a minimal request to verify the API key works
      const url = `${config.baseURL || this.baseURL}/messages`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': this.apiVersion,
        },
        body: JSON.stringify({
          model: config.model,
          max_tokens: 10,
          messages: [{ role: 'user', content: 'test' }],
        }),
        signal: AbortSignal.timeout(10000),
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
}
