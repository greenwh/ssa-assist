/**
 * Main LLM Service
 * Manages providers, prompt generation, and response handling
 */

import { GeminiProvider } from './providers/GeminiProvider';
import { OpenAIProvider } from './providers/OpenAIProvider';
import { ClaudeProvider } from './providers/ClaudeProvider';
import { XAIProvider } from './providers/XAIProvider';
import { PromptBuilder, type PromptContext } from './PromptBuilder';
import { indexedDBService } from '@/services/storage/IndexedDBService';
import { encryptionService } from '@/services/encryption/EncryptionService';
import { getAPIConfigFromEnv } from '@/utils/env';
import type { ILLMProvider } from './LLMProvider';
import type { LLMProviderType, LLMResponse, CostEstimate } from '@/types/llm';
import { PRICING } from '@/types/llm';

export class LLMService {
  private providers: Map<LLMProviderType, ILLMProvider>;
  private promptBuilder: PromptBuilder;
  private pricing: typeof PRICING;

  constructor() {
    this.providers = new Map();
    this.providers.set('gemini', new GeminiProvider());
    this.providers.set('openai', new OpenAIProvider());
    this.providers.set('claude', new ClaudeProvider());
    this.providers.set('xai', new XAIProvider());

    this.promptBuilder = new PromptBuilder();

    this.pricing = {
      gemini: { input: 0.075, output: 0.30 },
      openai: { input: 0.15, output: 0.60 },
      claude: { input: 3.0, output: 15.0 },
      xai: { input: 5.0, output: 15.0 },
    };
  }

  /**
   * Generate a response using the specified provider
   */
  async generate(
    context: PromptContext,
    providerType?: LLMProviderType
  ): Promise<LLMResponse> {
    // Get provider configuration
    const config = await this.getProviderConfig(providerType);

    // Get the provider
    const provider = this.providers.get(config.selectedProvider);
    if (!provider) {
      throw new Error(`Provider ${config.selectedProvider} not found`);
    }

    // Build the prompt
    const prompt = this.promptBuilder.buildPrompt(context);

    // Generate response
    try {
      const response = await provider.generateResponse(prompt, {
        apiKey: config.apiKey,
        model: config.model,
        timeout: 60000,
      });

      return response;
    } catch (error: any) {
      // Re-throw with user-friendly message
      throw new Error(error.message || 'Failed to generate response. Please try again.');
    }
  }

  /**
   * Estimate cost of generation
   */
  async estimateCost(
    context: PromptContext,
    providerType?: LLMProviderType
  ): Promise<CostEstimate> {
    const config = await this.getProviderConfig(providerType);
    const providerPricing = this.pricing[config.selectedProvider];

    const estimate = this.promptBuilder.estimateCost(context, providerPricing);

    return {
      estimatedTokens: estimate.estimatedTokens,
      estimatedCost: estimate.estimatedCost,
      currency: 'USD',
      provider: config.selectedProvider,
    };
  }

  /**
   * Test connection with provider
   */
  async testConnection(providerType: LLMProviderType): Promise<boolean> {
    const config = await this.getProviderConfig(providerType);
    const provider = this.providers.get(config.selectedProvider);

    if (!provider) {
      return false;
    }

    try {
      return await provider.testConnection({
        apiKey: config.apiKey,
        model: config.model,
      });
    } catch (error) {
      return false;
    }
  }

  /**
   * Get provider configuration from storage or environment
   */
  private async getProviderConfig(
    providerType?: LLMProviderType
  ): Promise<{
    selectedProvider: LLMProviderType;
    apiKey: string;
    model: string;
  }> {
    // Get user config from IndexedDB
    const userConfig = await indexedDBService.getConfig();
    if (!userConfig) {
      throw new Error('No configuration found. Please set up your API keys in Settings.');
    }

    // Determine which provider to use
    const selectedProvider = providerType || userConfig.selectedLLM;

    // Try to get API keys from storage first
    let apiKeys: Record<string, string> = {};
    let modelConfigs: Record<string, string> = {};

    try {
      const decryptedKeys = await encryptionService.decrypt(userConfig.encryptedAPIKeys);
      apiKeys = JSON.parse(decryptedKeys);

      if (userConfig.encryptedModelConfigs) {
        const decryptedModels = await encryptionService.decrypt(userConfig.encryptedModelConfigs);
        modelConfigs = JSON.parse(decryptedModels);
      }
    } catch (error) {
      console.error('Failed to decrypt API keys:', error);
    }

    // Fallback to environment variables if needed
    const envConfig = getAPIConfigFromEnv();

    const providerKeyMap: Record<LLMProviderType, string> = {
      gemini: 'gemini',
      openai: 'openai',
      claude: 'claude',
      xai: 'xai',
    };

    const providerEnvMap: Record<LLMProviderType, keyof typeof envConfig> = {
      gemini: 'google',
      openai: 'openai',
      claude: 'anthropic',
      xai: 'xai',
    };

    const providerKey = providerKeyMap[selectedProvider];
    const envKey = providerEnvMap[selectedProvider];

    // Get API key (storage first, then env)
    const apiKey = apiKeys[providerKey] || envConfig[envKey]?.apiKey || '';
    if (!apiKey) {
      throw new Error(
        `No API key found for ${selectedProvider}. Please configure it in Settings.`
      );
    }

    // Get model (storage first, then env, then default)
    const defaultModels: Record<LLMProviderType, string> = {
      gemini: 'gemini-2.0-flash-exp',
      openai: 'gpt-4o-mini',
      claude: 'claude-sonnet-4-5-20250929',
      xai: 'grok-beta',
    };

    const model =
      modelConfigs[providerKey] || envConfig[envKey]?.model || defaultModels[selectedProvider];

    return {
      selectedProvider,
      apiKey,
      model,
    };
  }
}

// Export singleton instance
export const llmService = new LLMService();
