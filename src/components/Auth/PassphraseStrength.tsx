import * as React from 'react';
import { cn } from '@/utils/cn';

interface PassphraseStrengthProps {
  score: number; // 0-4
  feedback: string[];
}

const PassphraseStrength: React.FC<PassphraseStrengthProps> = ({ score, feedback }) => {
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthColors = [
    'bg-error',
    'bg-warning',
    'bg-warning',
    'bg-success',
    'bg-success',
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              index <= score ? strengthColors[score] : 'bg-border'
            )}
          />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{strengthLabels[score]}</span>
        {feedback.length > 0 && (
          <div className="text-xs text-text-muted max-w-xs text-right">
            {feedback[0]}
          </div>
        )}
      </div>
    </div>
  );
};

export { PassphraseStrength };
