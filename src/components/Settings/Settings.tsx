import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Lock, Key, Cloud, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { indexedDBService } from '@/services/storage/IndexedDBService';
import { encryptionService } from '@/services/encryption/EncryptionService';
import { hasEnvAPIKeys, getEnvConfiguredProviders, getAPIConfigFromEnv } from '@/utils/env';

export const Settings: React.FC = () => {
  const { lock } = useAuthStore();
  const [selectedLLM, setSelectedLLM] = useState<'gemini' | 'openai' | 'claude' | 'xai'>('gemini');
  const [apiKeys, setApiKeys] = useState({
    gemini: '',
    openai: '',
    claude: '',
    xai: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const hasEnvKeys = hasEnvAPIKeys();
  const envProviders = getEnvConfiguredProviders();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const config = await indexedDBService.getConfig();
      if (config) {
        setSelectedLLM(config.selectedLLM);

        // Decrypt API keys
        const decryptedKeys = await encryptionService.decrypt(config.encryptedAPIKeys);
        const keys = JSON.parse(decryptedKeys);
        setApiKeys(keys);
      }

      // Load environment variable API keys if available
      if (hasEnvKeys) {
        const envConfig = getAPIConfigFromEnv();
        setApiKeys(prev => ({
          ...prev,
          gemini: envConfig.google?.apiKey || prev.gemini,
          openai: envConfig.openai?.apiKey || prev.openai,
          claude: envConfig.anthropic?.apiKey || prev.claude,
          xai: envConfig.xai?.apiKey || prev.xai,
        }));
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const config = await indexedDBService.getConfig();
      if (!config) {
        throw new Error('Config not found');
      }

      // Encrypt API keys
      const encryptedAPIKeys = await encryptionService.encrypt(JSON.stringify(apiKeys));

      await indexedDBService.saveConfig({
        ...config,
        selectedLLM,
        encryptedAPIKeys,
        lastModified: Date.now(),
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-text-muted">
          Configure your LLM provider, security settings, and preferences
        </p>
      </div>

      {saveSuccess && (
        <Alert variant="success">
          <p className="font-semibold">Settings Saved</p>
          <p className="text-sm mt-1">Your settings have been saved and encrypted successfully.</p>
        </Alert>
      )}

      {/* LLM Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            LLM Provider Configuration
          </CardTitle>
          <CardDescription>
            Configure your AI provider API keys. All keys are encrypted before storage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Environment Variable Status */}
          {hasEnvKeys && (
            <Alert variant="success">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Environment Variables Detected</p>
                  <p className="text-sm mt-1">
                    API keys configured via .env file for: {envProviders.join(', ')}
                  </p>
                  <p className="text-xs mt-2 opacity-75">
                    Environment variables take precedence over stored values
                  </p>
                </div>
              </div>
            </Alert>
          )}

          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Default Provider
            </label>
            <select
              value={selectedLLM}
              onChange={(e) => setSelectedLLM(e.target.value as any)}
              className="w-full h-11 rounded-md border border-border bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <option value="gemini">Google Gemini</option>
              <option value="openai">OpenAI (GPT-4)</option>
              <option value="claude">Anthropic Claude</option>
              <option value="xai">xAI (Grok)</option>
            </select>
          </div>

          {/* API Keys */}
          <div className="space-y-4">
            <Input
              type="password"
              label="Gemini API Key"
              placeholder="AIza..."
              value={apiKeys.gemini}
              onChange={(e) => setApiKeys({ ...apiKeys, gemini: e.target.value })}
              helpText="Get your API key from Google AI Studio"
              disabled={hasEnvKeys}
            />
            <Input
              type="password"
              label="OpenAI API Key"
              placeholder="sk-..."
              value={apiKeys.openai}
              onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
              helpText="Get your API key from platform.openai.com"
              disabled={hasEnvKeys}
            />
            <Input
              type="password"
              label="Claude API Key"
              placeholder="sk-ant-..."
              value={apiKeys.claude}
              onChange={(e) => setApiKeys({ ...apiKeys, claude: e.target.value })}
              helpText="Get your API key from console.anthropic.com"
              disabled={hasEnvKeys}
            />
            <Input
              type="password"
              label="xAI (Grok) API Key"
              placeholder="xai-..."
              value={apiKeys.xai}
              onChange={(e) => setApiKeys({ ...apiKeys, xai: e.target.value })}
              helpText="Get your API key from console.x.ai"
              disabled={hasEnvKeys}
            />
          </div>

          <Alert variant="info">
            <p className="text-sm">
              <strong>Note:</strong> API keys are encrypted with your passphrase before being stored.
              You'll be charged directly by the provider based on your usage.
            </p>
          </Alert>

          <Button onClick={handleSaveSettings} isLoading={isSaving}>
            Save API Settings
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your security and session preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div>
              <p className="font-medium">Auto-Lock Timeout</p>
              <p className="text-sm text-text-muted">
                Currently set to 30 minutes
              </p>
            </div>
            <Badge variant="default">Active</Badge>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div>
              <p className="font-medium">Session Status</p>
              <p className="text-sm text-text-muted">
                Your session is currently unlocked
              </p>
            </div>
            <Button variant="outline" onClick={lock}>
              Lock Now
            </Button>
          </div>

          <Alert variant="warning">
            <p className="text-sm">
              <strong>Remember:</strong> If you forget your passphrase, there is no way to recover your data.
              Consider using a password manager to store it securely.
            </p>
          </Alert>
        </CardContent>
      </Card>

      {/* Cloud Sync (Future Feature) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Cloud Sync (Coming Soon)
          </CardTitle>
          <CardDescription>
            Optionally sync your encrypted data to your personal cloud storage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="info">
            <p className="text-sm">
              Cloud sync will be available in a future update. Your data will remain encrypted
              and synced to your personal OneDrive or Google Drive account.
            </p>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

// Add Badge import if not already in file
import { Badge } from '@/components/ui/Badge';
