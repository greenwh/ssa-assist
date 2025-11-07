/**
 * Step 3: AI Generation
 * Generate SSA report responses using AI based on Blue Book listings and functional inputs
 */

import React, { useState } from 'react';
import { Sparkles, Copy, RotateCcw, AlertCircle, DollarSign, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { useWizard } from '../WizardContext';
import { llmService } from '@/services/llm/LLMService';
import type { PromptContext } from '@/services/llm/PromptBuilder';
import type { CostEstimate } from '@/types/llm';

// SSA Form questions to generate responses for
const SSA_QUESTIONS = [
  {
    id: 'daily_routine',
    category: 'daily_activities',
    question: 'Describe what you do from the time you wake up until you go to bed.',
  },
  {
    id: 'household_tasks',
    category: 'household',
    question: 'Describe your ability to do household chores and yard work.',
  },
  {
    id: 'going_out',
    category: 'transportation',
    question: 'Describe your ability to go out alone and use transportation.',
  },
  {
    id: 'social_life',
    category: 'social',
    question: 'How have your illnesses or conditions affected your social activities and relationships?',
  },
  {
    id: 'physical_limitations',
    category: 'limitations',
    question: 'Describe your physical limitations, including how far you can walk, how much you can lift, and how long you can stand or sit.',
  },
  {
    id: 'mental_limitations',
    category: 'limitations',
    question: 'Describe any difficulties with memory, concentration, following instructions, or handling stress.',
  },
];

export const AIGeneration: React.FC = () => {
  const { draftData, updateDraftData } = useWizard();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [generatedResponses, setGeneratedResponses] = useState<Record<string, string>>(
    (draftData.generatedSections as Record<string, string>) || {}
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [costEstimate, setCostEstimate] = useState<CostEstimate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentQuestion = SSA_QUESTIONS[currentQuestionIndex];
  const currentResponse = generatedResponses[currentQuestion.id] || '';

  // Build prompt context
  const buildPromptContext = (): PromptContext => {
    return {
      blueBookListings: draftData.selectedBlueBookListings || [],
      functionalInputs: draftData.functionalInputs || {},
      ssaQuestion: currentQuestion.question,
      questionCategory: currentQuestion.category,
    };
  };

  // Estimate cost
  const handleEstimateCost = async () => {
    try {
      const context = buildPromptContext();
      const estimate = await llmService.estimateCost(context);
      setCostEstimate(estimate);
    } catch (err: any) {
      console.error('Cost estimation failed:', err);
    }
  };

  // Generate response
  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const context = buildPromptContext();
      const response = await llmService.generate(context);

      const newResponses = {
        ...generatedResponses,
        [currentQuestion.id]: response.text,
      };

      setGeneratedResponses(newResponses);
      updateDraftData({
        generatedSections: newResponses,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to generate response. Please check your Settings and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy to clipboard
  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Edit response manually
  const handleEdit = (value: string) => {
    const newResponses = {
      ...generatedResponses,
      [currentQuestion.id]: value,
    };
    setGeneratedResponses(newResponses);
    updateDraftData({
      generatedSections: newResponses,
    });
  };

  // Calculate completion
  const completedCount = Object.keys(generatedResponses).length;
  const totalCount = SSA_QUESTIONS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">
            Question {currentQuestionIndex + 1} of {totalCount}
          </span>
          <span className="font-medium">{progressPercent}% Complete</span>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Navigator */}
      <div className="grid grid-cols-6 gap-2">
        {SSA_QUESTIONS.map((q, index) => {
          const hasResponse = generatedResponses[q.id];
          const isCurrent = index === currentQuestionIndex;

          return (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`
                p-3 rounded-lg border-2 text-sm font-medium transition-all
                ${isCurrent ? 'border-primary bg-primary/10' : 'border-border hover:border-border-hover'}
                ${hasResponse ? 'bg-success/10' : ''}
              `}
            >
              {index + 1}
              {hasResponse && <Check className="h-3 w-3 inline ml-1 text-success" />}
            </button>
          );
        })}
      </div>

      {/* Current Question */}
      <div className="border border-border rounded-lg p-6 bg-surface">
        <div className="flex items-start gap-3 mb-4">
          <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">SSA Form Question</h2>
            <p className="text-lg">{currentQuestion.question}</p>
          </div>
        </div>

        {/* Cost Estimate */}
        {!costEstimate && !currentResponse && (
          <Button variant="outline" size="sm" onClick={handleEstimateCost} className="mb-4">
            <DollarSign className="h-4 w-4 mr-2" />
            Estimate Cost
          </Button>
        )}

        {costEstimate && (
          <Alert variant="info" className="mb-4">
            <div className="text-sm">
              <p>
                <strong>Estimated Cost:</strong> ${costEstimate.estimatedCost.toFixed(4)} USD
              </p>
              <p className="text-xs mt-1 opacity-75">
                ~{costEstimate.estimatedTokens} tokens using {costEstimate.provider}
              </p>
            </div>
          </Alert>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="error" className="mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Generation Failed</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </Alert>
        )}

        {/* Generate Button */}
        {!currentResponse && (
          <div className="space-y-3">
            <Button onClick={handleGenerate} isLoading={isGenerating} className="w-full">
              <Sparkles className="h-5 w-5 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Response with AI'}
            </Button>
            <p className="text-xs text-text-muted text-center">
              AI will create a response based on your selected Blue Book listings and functional inputs
            </p>
          </div>
        )}

        {/* Generated Response */}
        {currentResponse && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="success">Generated</Badge>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(currentResponse, currentQuestion.id)}
                >
                  {copiedId === currentQuestion.id ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={handleGenerate} isLoading={isGenerating}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>

            <textarea
              value={currentResponse}
              onChange={(e) => handleEdit(e.target.value)}
              className="w-full min-h-[300px] px-4 py-3 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary resize-y font-sans"
              placeholder="Generated response will appear here..."
            />

            <div className="flex items-center justify-between text-sm text-text-muted">
              <span>{currentResponse.length} characters</span>
              <span>You can edit the text above before moving to the next question</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
        >
          Previous Question
        </Button>

        {currentQuestionIndex < SSA_QUESTIONS.length - 1 ? (
          <Button
            onClick={() => setCurrentQuestionIndex((prev) => Math.min(SSA_QUESTIONS.length - 1, prev + 1))}
          >
            Next Question
          </Button>
        ) : (
          <Badge variant="success" className="px-4 py-2">
            All Questions Complete!
          </Badge>
        )}
      </div>
    </div>
  );
};
