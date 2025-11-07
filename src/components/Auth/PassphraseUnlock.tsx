import * as React from 'react';
import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface PassphraseUnlockProps {
  onUnlock: (passphrase: string) => Promise<boolean>;
}

export const PassphraseUnlock: React.FC<PassphraseUnlockProps> = ({ onUnlock }) => {
  const [passphrase, setPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [error, setError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsUnlocking(true);

    try {
      const success = await onUnlock(passphrase);
      if (!success) {
        setError('Incorrect passphrase. Please try again.');
        setPassphrase('');
      }
    } catch (err) {
      setError('Failed to unlock. Please try again.');
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-6 w-6" />
              Unlock SSA Form-Assist
            </CardTitle>
            <CardDescription>
              Enter your passphrase to access your encrypted data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                type={showPassphrase ? 'text' : 'password'}
                label="Passphrase"
                placeholder="Enter your passphrase"
                value={passphrase}
                onChange={(e) => {
                  setPassphrase(e.target.value);
                  setError('');
                }}
                error={error}
                autoFocus
                disabled={isUnlocking}
              />
              <button
                type="button"
                onClick={() => setShowPassphrase(!showPassphrase)}
                className="absolute right-3 top-[38px] text-text-muted hover:text-text"
                aria-label={showPassphrase ? 'Hide passphrase' : 'Show passphrase'}
                disabled={isUnlocking}
              >
                {showPassphrase ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="bg-surface border border-border rounded-md p-3 text-sm text-text-muted">
              <p>
                <strong>Note:</strong> Your data is encrypted with your passphrase.
                If you've forgotten it, there is no way to recover your data.
              </p>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" isLoading={isUnlocking} disabled={!passphrase || isUnlocking}>
              Unlock
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
