/**
 * Environment variable utilities
 * Safely access environment variables with type safety
 */

export interface APIConfig {
  anthropic: {
    apiKey: string;
    model: string;
  };
  google: {
    apiKey: string;
    model: string;
  };
  openai: {
    apiKey: string;
    model: string;
  };
  xai: {
    apiKey: string;
    model: string;
  };
}

/**
 * Get environment variable value
 */
const getEnvVar = (key: string): string => {
  if (typeof import.meta.env === 'undefined') return '';
  return (import.meta.env as Record<string, string>)[key] || '';
};

/**
 * Check if environment variable is set
 */
const hasEnvVar = (key: string): boolean => {
  if (typeof import.meta.env === 'undefined') return false;
  const value = (import.meta.env as Record<string, string>)[key];
  return value !== undefined && value !== '';
};

/**
 * Get API configuration from environment variables
 */
export const getAPIConfigFromEnv = (): Partial<APIConfig> => {
  const config: Partial<APIConfig> = {};

  // Anthropic Claude
  if (hasEnvVar('VITE_ANTHROPIC_API_KEY')) {
    config.anthropic = {
      apiKey: getEnvVar('VITE_ANTHROPIC_API_KEY'),
      model: getEnvVar('VITE_ANTHROPIC_API_MODEL') || 'claude-sonnet-4-5-20250929',
    };
  }

  // Google Gemini
  if (hasEnvVar('VITE_GOOGLE_API_KEY')) {
    config.google = {
      apiKey: getEnvVar('VITE_GOOGLE_API_KEY'),
      model: getEnvVar('VITE_GEMINI_API_MODEL') || 'gemini-2.0-flash-exp',
    };
  }

  // OpenAI
  if (hasEnvVar('VITE_OPENAI_API_KEY')) {
    config.openai = {
      apiKey: getEnvVar('VITE_OPENAI_API_KEY'),
      model: getEnvVar('VITE_OPENAI_API_MODEL') || 'gpt-4o-mini',
    };
  }

  // xAI
  if (hasEnvVar('VITE_XAI_API_KEY')) {
    config.xai = {
      apiKey: getEnvVar('VITE_XAI_API_KEY'),
      model: getEnvVar('VITE_XAI_API_MODEL') || 'grok-beta',
    };
  }

  return config;
};

/**
 * Check if any API keys are configured via environment variables
 */
export const hasEnvAPIKeys = (): boolean => {
  return (
    hasEnvVar('VITE_ANTHROPIC_API_KEY') ||
    hasEnvVar('VITE_GOOGLE_API_KEY') ||
    hasEnvVar('VITE_OPENAI_API_KEY') ||
    hasEnvVar('VITE_XAI_API_KEY')
  );
};

/**
 * Get list of providers configured via environment
 */
export const getEnvConfiguredProviders = (): string[] => {
  const providers: string[] = [];

  if (hasEnvVar('VITE_ANTHROPIC_API_KEY')) providers.push('Claude (Anthropic)');
  if (hasEnvVar('VITE_GOOGLE_API_KEY')) providers.push('Gemini (Google)');
  if (hasEnvVar('VITE_OPENAI_API_KEY')) providers.push('OpenAI');
  if (hasEnvVar('VITE_XAI_API_KEY')) providers.push('Grok (xAI)');

  return providers;
};
