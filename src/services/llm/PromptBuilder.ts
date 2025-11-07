/**
 * Prompt Template Builder for SSA Function Report Generation
 * Builds context-aware prompts based on Blue Book listings and user inputs
 */

import type { PromptConfig } from '@/types/llm';
import type { SSAFormData } from '@/types/ssa-form';

export interface PromptContext {
  blueBookListings: string[];
  functionalInputs: Partial<SSAFormData>;
  ssaQuestion: string;
  questionCategory: string;
}

export class PromptBuilder {
  /**
   * Base system prompt for all SSA report generation
   */
  private readonly baseSystemPrompt = `You are an expert assistant helping individuals complete the SSA Adult Function Report (Form SSA-3373). Your role is to transform their input into clear, detailed, and medically-relevant descriptions that accurately represent their functional limitations.

CRITICAL GUIDELINES:
1. Use ONLY the information provided by the user - do not invent or assume details
2. Write in first person ("I", "my") as if the claimant is speaking
3. Be specific and concrete with examples from their daily life
4. Focus on HOW limitations affect daily activities, not just what they can't do
5. Include relevant medical context when the user mentions it
6. Avoid medical jargon - use plain language
7. Be honest and accurate - exaggeration hurts credibility
8. If user input is vague, work with what they provided without adding speculation

TONE: Honest, clear, and matter-of-fact. Neither minimizing nor exaggerating limitations.

OUTPUT FORMAT: Return ONLY the completed response text. Do not include explanations, meta-commentary, or suggestions for improvement.`;

  /**
   * Build a complete prompt for SSA report generation
   */
  buildPrompt(context: PromptContext): PromptConfig {
    const systemPrompt = this.buildSystemPrompt(context);
    const userPrompt = this.buildUserPrompt(context);

    return {
      systemPrompt,
      userPrompt,
      temperature: 0.7,
      maxTokens: 1024,
      context,
    };
  }

  /**
   * Build system prompt with Blue Book context
   */
  private buildSystemPrompt(context: PromptContext): string {
    let prompt = this.baseSystemPrompt;

    if (context.blueBookListings && context.blueBookListings.length > 0) {
      prompt += `\n\nRELEVANT DISABILITY LISTINGS:\nThe user has selected the following SSA Blue Book disability listings as relevant to their condition:\n`;
      context.blueBookListings.forEach((listing) => {
        prompt += `- ${listing}\n`;
      });
      prompt += `\nKeep these conditions in mind when describing functional limitations, but only reference them if the user's input specifically relates to symptoms of these conditions.`;
    }

    return prompt;
  }

  /**
   * Build user prompt with question and inputs
   */
  private buildUserPrompt(context: PromptContext): string {
    let prompt = `SSA FORM QUESTION:\n"${context.ssaQuestion}"\n\n`;

    // Add relevant functional inputs based on question category
    const relevantInputs = this.extractRelevantInputs(context);

    if (relevantInputs && Object.keys(relevantInputs).length > 0) {
      prompt += `MY INPUT:\n${this.formatInputs(relevantInputs)}\n\n`;
    }

    prompt += `TASK: Based on my input above, write a clear and detailed response to the SSA question. Use first person ("I", "my"). Include specific examples and details that illustrate how my condition affects this aspect of my daily life. Keep the response factual and grounded in what I actually provided.`;

    return prompt;
  }

  /**
   * Extract relevant inputs based on question category
   */
  private extractRelevantInputs(context: PromptContext): Record<string, any> {
    const { functionalInputs, questionCategory } = context;
    const relevant: Record<string, any> = {};

    // Map question categories to relevant form sections
    const categoryMap: Record<string, string[]> = {
      daily_activities: ['daily_activities', 'personal_care'],
      household: ['household_activities'],
      transportation: ['going_places'],
      social: ['social_activities'],
      limitations: ['functional_limitations'],
      medical: ['medications'],
      all: Object.keys(functionalInputs),
    };

    const sections = categoryMap[questionCategory] || categoryMap.all;

    sections.forEach((section) => {
      if (functionalInputs[section as keyof SSAFormData]) {
        relevant[section] = functionalInputs[section as keyof SSAFormData];
      }
    });

    return relevant;
  }

  /**
   * Format inputs into readable text
   */
  private formatInputs(inputs: Record<string, any>): string {
    const formatted: string[] = [];

    Object.entries(inputs).forEach(([section, data]) => {
      if (typeof data === 'object' && data !== null) {
        this.formatSection(section, data, formatted);
      }
    });

    return formatted.join('\n\n');
  }

  /**
   * Format a single section of inputs
   */
  private formatSection(section: string, data: any, output: string[]): void {
    const sectionName = this.getSectionName(section);
    const lines: string[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') return;

      const label = this.formatLabel(key);

      if (typeof value === 'boolean') {
        lines.push(`${label}: ${value ? 'Yes' : 'No'}`);
      } else if (Array.isArray(value)) {
        if (value.length > 0) {
          lines.push(`${label}: ${value.join(', ')}`);
        }
      } else if (typeof value === 'object') {
        this.formatSection(key, value, lines);
      } else {
        lines.push(`${label}: ${value}`);
      }
    });

    if (lines.length > 0) {
      output.push(`${sectionName}:\n${lines.join('\n')}`);
    }
  }

  /**
   * Get human-readable section name
   */
  private getSectionName(key: string): string {
    const names: Record<string, string> = {
      daily_activities: 'Daily Activities',
      personal_care: 'Personal Care',
      household_activities: 'Household Activities',
      going_places: 'Transportation & Going Out',
      social_activities: 'Social Activities',
      functional_limitations: 'Functional Limitations',
      medications: 'Medications',
      care_for_others: 'Caring for Others',
      care_for_pets: 'Pet Care',
      prepare_meals: 'Meal Preparation',
      house_and_yard_work: 'House and Yard Work',
      transportation: 'Transportation',
      shopping: 'Shopping',
      money_management: 'Money Management',
      hobbies_and_interests: 'Hobbies',
      walking_ability: 'Walking Ability',
    };

    return names[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  /**
   * Format field label
   */
  private formatLabel(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  /**
   * Estimate cost of generation
   */
  estimateCost(context: PromptContext, providerPricing: { input: number; output: number }): {
    estimatedTokens: number;
    estimatedCost: number;
  } {
    const prompt = this.buildPrompt(context);
    const inputText = prompt.systemPrompt + prompt.userPrompt;
    const outputTokens = prompt.maxTokens || 1024;

    // Rough estimate: 4 characters per token
    const inputTokens = Math.ceil(inputText.length / 4);
    const estimatedTokens = inputTokens + outputTokens;

    // Calculate cost (pricing is per 1M tokens)
    const inputCost = (inputTokens / 1000000) * providerPricing.input;
    const outputCost = (outputTokens / 1000000) * providerPricing.output;
    const estimatedCost = inputCost + outputCost;

    return {
      estimatedTokens,
      estimatedCost,
    };
  }
}
