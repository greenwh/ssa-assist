import * as React from 'react';
import { useState } from 'react';
import { Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PassphraseStrength } from './PassphraseStrength';
import { encryptionService } from '@/services/encryption/EncryptionService';

interface PassphraseSetupProps {
  onComplete: (salt: Uint8Array) => void;
}

export const PassphraseSetup: React.FC<PassphraseSetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'disclaimer' | 'create' | 'confirm'>('disclaimer');
  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [strength, setStrength] = useState({ score: 0, feedback: [] as string[] });
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false);

  const handlePassphraseChange = (value: string) => {
    setPassphrase(value);
    setError('');
    const strengthResult = encryptionService.calculatePassphraseStrength(value);
    setStrength(strengthResult);
  };

  const handleCreatePassphrase = () => {
    if (passphrase.length < 8) {
      setError('Passphrase must be at least 8 characters');
      return;
    }

    if (strength.score < 2) {
      setError('Please choose a stronger passphrase');
      return;
    }

    setStep('confirm');
  };

  const handleConfirmPassphrase = async () => {
    if (passphrase !== confirmPassphrase) {
      setError('Passphrases do not match');
      return;
    }

    try {
      const salt = await encryptionService.initialize(passphrase);
      onComplete(salt);
    } catch (err) {
      setError('Failed to initialize encryption. Please try again.');
    }
  };

  if (step === 'disclaimer') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-warning" />
            Important Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-warning/10 border border-warning/20 rounded-md p-4">
            <p className="font-semibold mb-2">
              This application is NOT affiliated with the Social Security Administration.
            </p>
            <ul className="space-y-2 text-sm">
              <li>• This tool provides GUIDANCE ONLY and does not constitute legal or medical advice.</li>
              <li>• You are SOLELY RESPONSIBLE for the accuracy of information submitted to the SSA.</li>
              <li>• All data is stored ENCRYPTED on your device and (optionally) your personal cloud.</li>
              <li>• We DO NOT HAVE ACCESS to your information.</li>
              <li>• Always REVIEW AND VERIFY all generated content before submission.</li>
            </ul>
          </div>

          <div className="bg-error/10 border border-error/20 rounded-md p-4">
            <p className="font-semibold text-error mb-2">
              CRITICAL: Lost Passphrase = Lost Data
            </p>
            <p className="text-sm">
              Your passphrase is the ONLY way to access your encrypted data. If you forget it,
              there is NO RECOVERY OPTION. All your data will be permanently inaccessible.
            </p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToDisclaimer}
              onChange={(e) => setAgreedToDisclaimer(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border"
            />
            <span className="text-sm">
              I understand and agree to these terms. I will securely store my passphrase.
            </span>
          </label>
        </CardContent>
        <CardFooter className="justify-end">
          <Button
            onClick={() => setStep('create')}
            disabled={!agreedToDisclaimer}
          >
            Continue to Setup
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (step === 'create') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-6 w-6" />
            Create Your Passphrase
          </CardTitle>
          <CardDescription>
            Choose a strong passphrase to encrypt your data. You'll need this every time you use the app.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              type={showPassphrase ? 'text' : 'password'}
              label="Passphrase"
              placeholder="Enter a strong passphrase"
              value={passphrase}
              onChange={(e) => handlePassphraseChange(e.target.value)}
              error={error}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassphrase(!showPassphrase)}
              className="absolute right-3 top-[38px] text-text-muted hover:text-text"
              aria-label={showPassphrase ? 'Hide passphrase' : 'Show passphrase'}
            >
              {showPassphrase ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {passphrase && (
            <PassphraseStrength score={strength.score} feedback={strength.feedback} />
          )}

          <div className="bg-surface border border-border rounded-md p-3 text-sm">
            <p className="font-semibold mb-1">Tips for a strong passphrase:</p>
            <ul className="text-text-muted space-y-1">
              <li>• Use at least 12 characters</li>
              <li>• Mix uppercase, lowercase, numbers, and symbols</li>
              <li>• Avoid common words or patterns</li>
              <li>• Consider using a passphrase manager</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button variant="ghost" onClick={() => setStep('disclaimer')}>
            Back
          </Button>
          <Button onClick={handleCreatePassphrase}>
            Continue
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Confirm Your Passphrase</CardTitle>
        <CardDescription>
          Re-enter your passphrase to confirm. Make sure to store it securely.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Input
            type={showConfirm ? 'text' : 'password'}
            label="Confirm Passphrase"
            placeholder="Re-enter your passphrase"
            value={confirmPassphrase}
            onChange={(e) => {
              setConfirmPassphrase(e.target.value);
              setError('');
            }}
            error={error}
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-[38px] text-text-muted hover:text-text"
            aria-label={showConfirm ? 'Hide passphrase' : 'Show passphrase'}
          >
            {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="ghost" onClick={() => setStep('create')}>
          Back
        </Button>
        <Button onClick={handleConfirmPassphrase}>
          Complete Setup
        </Button>
      </CardFooter>
    </Card>
  );
};
