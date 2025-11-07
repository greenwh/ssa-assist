/**
 * xAI (Grok) Provider
 * Implements the xAI API (OpenAI-compatible)
 */

import { BaseLLMProvider } from '../LLMProvider';
import type { PromptConfig, LLMResponse, ProviderConfig } from '@/types/llm';

export class XAIProvider extends BaseLLMProvider {
  private readonly baseURL = 'https://api.x.ai/v1';

  getProviderName(): string {
    return 'xai';
  }

  async generateResponse(prompt: PromptConfig, config: ProviderConfig): Promise<LLMResponse> {
    this.validateApiKey(config.apiKey, 'xai-');

    const url = `${config.baseURL || this.baseURL}/chat/completions`;

    const requestBody = {
      model: config.model,
      messages: [
        {
          role: 'system',
          content: prompt.systemPrompt,
        },
        {
          role: 'user',
          content: prompt.userPrompt,
        },
      ],
      temperature: prompt.temperature ?? 0.7,
      max_tokens: prompt.maxTokens ?? 2048,
      stream: false,
    };

    return this.retryWithBackoff(async () => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(config.timeout ?? 60000),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
        throw this.handleHTTPError(
          response.status,
          error.error?.message || 'xAI API request failed'
        );
      }

      const data = await response.json();

      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response from xAI API');
      }

      return {
        text: data.choices[0].message.content,
        usage: data.usage
          ? {
              promptTokens: data.usage.prompt_tokens || 0,
              completionTokens: data.usage.completion_tokens || 0,
              totalTokens: data.usage.total_tokens || 0,
            }
          : undefined,
        model: data.model,
        provider: 'xai',
      };
    });
  }

  async testConnection(config: ProviderConfig): Promise<boolean> {
    try {
      this.validateApiKey(config.apiKey, 'xai-');

      const url = `${config.baseURL || this.baseURL}/models`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
        signal: AbortSignal.timeout(10000),
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
}
