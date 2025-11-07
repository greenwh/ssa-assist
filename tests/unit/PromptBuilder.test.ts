/**
 * PromptBuilder Unit Tests
 * Tests for prompt generation and formatting
 */

import { describe, it, expect } from 'vitest';
import { PromptBuilder } from '@/services/llm/PromptBuilder';
import type { PromptContext } from '@/services/llm/PromptBuilder';

describe('PromptBuilder', () => {
  let builder: PromptBuilder;

  beforeEach(() => {
    builder = new PromptBuilder();
  });

  describe('Basic Prompt Generation', () => {
    it('should build prompt with minimal context', () => {
      const context: PromptContext = {
        blueBookListings: [],
        functionalInputs: {},
        ssaQuestion: 'Test question?',
        questionCategory: 'daily_activities',
      };

      const prompt = builder.buildPrompt(context);

      expect(prompt).toBeDefined();
      expect(prompt.systemPrompt).toContain('SSA Adult Function Report');
      expect(prompt.userPrompt).toContain('Test question?');
      expect(prompt.temperature).toBe(0.7);
      expect(prompt.maxTokens).toBe(1024);
    });

    it('should include Blue Book listings in system prompt', () => {
      const context: PromptContext = {
        blueBookListings: ['1.00 Musculoskeletal Disorders', '12.00 Mental Disorders'],
        functionalInputs: {},
        ssaQuestion: 'Describe your limitations.',
        questionCategory: 'limitations',
      };

      const prompt = builder.buildPrompt(context);

      expect(prompt.systemPrompt).toContain('1.00 Musculoskeletal Disorders');
      expect(prompt.systemPrompt).toContain('12.00 Mental Disorders');
      expect(prompt.systemPrompt).toContain('RELEVANT DISABILITY LISTINGS');
    });

    it('should include functional inputs in user prompt', () => {
      const context: PromptContext = {
        blueBookListings: [],
        functionalInputs: {
          daily_activities: {
            wake_up_time: '8:00 AM',
            sleep_time: '10:00 PM',
          },
        },
        ssaQuestion: 'Describe your daily routine.',
        questionCategory: 'daily_activities',
      };

      const prompt = builder.buildPrompt(context);

      expect(prompt.userPrompt).toContain('8:00 AM');
      expect(prompt.userPrompt).toContain('10:00 PM');
      expect(prompt.userPrompt).toContain('MY INPUT');
    });
  });

  describe('Input Formatting', () => {
    it('should format boolean values correctly', () => {
      const context: PromptContext = {
        blueBookListings: [],
        functionalInputs: {
          daily_activities: {
            care_for_others: {
              cares_for: true,
            },
          },
        },
        ssaQuestion: 'Do you care for others?',
        questionCategory: 'daily_activities',
      };

      const prompt = builder.buildPrompt(context);

      expect(prompt.userPrompt).toContain('Yes');
    });

    it('should format arrays as comma-separated lists', () => {
      const context: PromptContext = {
        blueBookListings: [],
        functionalInputs: {
          household_activities: {
            house_and_yard_work: {
              activities: ['Cleaning', 'Laundry', 'Dishes'],
            },
          },
        },
        ssaQuestion: 'What household chores do you do?',
        questionCategory: 'household',
      };

      const prompt = builder.buildPrompt(context);

      expect(prompt.userPrompt).toContain('Cleaning, Laundry, Dishes');
    });

    it('should skip empty values', () => {
      const context: PromptContext = {
        blueBookListings: [],
        functionalInputs: {
          daily_activities: {
            wake_up_time: '8:00 AM',
            sleep_time: '',
          },
        },
        ssaQuestion: 'Describe your schedule.',
        questionCategory: 'daily_activities',
      };

      const prompt = builder.buildPrompt(context);

      expect(prompt.userPrompt).toContain('8:00 AM');
      expect(prompt.userPrompt).not.toContain('Sleep Time:');
    });
  });

  describe('Cost Estimation', () => {
    it('should estimate cost based on token count', () => {
      const context: PromptContext = {
        blueBookListings: ['1.00 Test'],
        functionalInputs: {
          daily_activities: {
            wake_up_time: '8:00 AM',
          },
        },
        ssaQuestion: 'Test question?',
        questionCategory: 'daily_activities',
      };

      const pricing = { input: 0.15, output: 0.60 }; // GPT-4o-mini pricing

      const estimate = builder.estimateCost(context, pricing);

      expect(estimate.estimatedTokens).toBeGreaterThan(0);
      expect(estimate.estimatedCost).toBeGreaterThan(0);
      expect(typeof estimate.estimatedCost).toBe('number');
    });

    it('should use configured max tokens for output estimation', () => {
      const context: PromptContext = {
        blueBookListings: [],
        functionalInputs: {},
        ssaQuestion: 'Short question?',
        questionCategory: 'all',
      };

      const pricing = { input: 0.15, output: 0.60 };
      const estimate = builder.estimateCost(context, pricing);

      // Should include 1024 tokens for output (default maxTokens)
      expect(estimate.estimatedTokens).toBeGreaterThanOrEqual(1024);
    });
  });

  describe('Section Name Formatting', () => {
    it('should convert snake_case to Title Case', () => {
      const context: PromptContext = {
        blueBookListings: [],
        functionalInputs: {
          functional_limitations: {
            walking_ability: {
              distance_before_rest: '100 feet',
            },
          },
        },
        ssaQuestion: 'Describe your walking ability.',
        questionCategory: 'limitations',
      };

      const prompt = builder.buildPrompt(context);

      expect(prompt.userPrompt).toContain('Functional Limitations');
      expect(prompt.userPrompt).toContain('Walking Ability');
    });
  });

  describe('Category-Based Input Extraction', () => {
    it('should extract only relevant inputs for daily_activities', () => {
      const context: PromptContext = {
        blueBookListings: [],
        functionalInputs: {
          daily_activities: {
            wake_up_time: '8:00 AM',
          },
          functional_limitations: {
            lifting_capacity: '10 pounds',
          },
        },
        ssaQuestion: 'Describe your daily routine.',
        questionCategory: 'daily_activities',
      };

      const prompt = builder.buildPrompt(context);

      expect(prompt.userPrompt).toContain('8:00 AM');
      expect(prompt.userPrompt).not.toContain('lifting_capacity');
    });

    it('should extract only relevant inputs for limitations', () => {
      const context: PromptContext = {
        blueBookListings: [],
        functionalInputs: {
          daily_activities: {
            wake_up_time: '8:00 AM',
          },
          functional_limitations: {
            lifting_capacity: '10 pounds',
          },
        },
        ssaQuestion: 'Describe your physical limitations.',
        questionCategory: 'limitations',
      };

      const prompt = builder.buildPrompt(context);

      expect(prompt.userPrompt).toContain('10 pounds');
      expect(prompt.userPrompt).not.toContain('8:00 AM');
    });

    it('should extract all inputs when category is "all"', () => {
      const context: PromptContext = {
        blueBookListings: [],
        functionalInputs: {
          daily_activities: {
            wake_up_time: '8:00 AM',
          },
          functional_limitations: {
            lifting_capacity: '10 pounds',
          },
        },
        ssaQuestion: 'Describe everything.',
        questionCategory: 'all',
      };

      const prompt = builder.buildPrompt(context);

      expect(prompt.userPrompt).toContain('8:00 AM');
      expect(prompt.userPrompt).toContain('10 pounds');
    });
  });
});
