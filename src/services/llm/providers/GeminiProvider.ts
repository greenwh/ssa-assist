/**
 * Google Gemini Provider
 * Implements the Google Gemini API
 */

import { BaseLLMProvider } from '../LLMProvider';
import type { PromptConfig, LLMResponse, ProviderConfig } from '@/types/llm';

export class GeminiProvider extends BaseLLMProvider {
  private readonly baseURL = 'https://generativelanguage.googleapis.com/v1beta';

  getProviderName(): string {
    return 'gemini';
  }

  async generateResponse(prompt: PromptConfig, config: ProviderConfig): Promise<LLMResponse> {
    this.validateApiKey(config.apiKey);

    const url = `${this.baseURL}/models/${config.model}:generateContent?key=${config.apiKey}`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${prompt.systemPrompt}\n\n${prompt.userPrompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: prompt.temperature ?? 0.7,
        maxOutputTokens: prompt.maxTokens ?? 2048,
        topP: 0.95,
        topK: 40,
      },
    };

    return this.retryWithBackoff(async () => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(config.timeout ?? 60000),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
        throw this.handleHTTPError(
          response.status,
          error.error?.message || 'Gemini API request failed'
        );
      }

      const data = await response.json();

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response from Gemini API');
      }

      return {
        text: data.candidates[0].content.parts[0].text,
        usage: data.usageMetadata
          ? {
              promptTokens: data.usageMetadata.promptTokenCount || 0,
              completionTokens: data.usageMetadata.candidatesTokenCount || 0,
              totalTokens: data.usageMetadata.totalTokenCount || 0,
            }
          : undefined,
        model: config.model,
        provider: 'gemini',
      };
    });
  }

  async testConnection(config: ProviderConfig): Promise<boolean> {
    try {
      this.validateApiKey(config.apiKey);

      const url = `${this.baseURL}/models/${config.model}?key=${config.apiKey}`;

      const response = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(10000),
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
}
