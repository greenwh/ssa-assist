/**
 * Storage-related type definitions
 */

import type { EncryptedData } from './encryption';

export interface UserConfig {
  id: 'user-config';
  salt: string;                    // Base64-encoded salt
  selectedLLM: 'gemini' | 'openai' | 'claude' | 'xai';
  encryptedAPIKeys: EncryptedData; // Encrypted JSON of API keys
  encryptedModelConfigs: EncryptedData; // Encrypted JSON of model names per provider
  encryptedCloudConfig?: EncryptedData; // Optional cloud sync config
  lastModified: number;
  testEncryptedData: EncryptedData; // For passphrase verification
}

export interface Report {
  id: string;                      // UUID
  encryptedData: EncryptedData;    // Entire report encrypted
  encryptedTitle: EncryptedData;   // Title encrypted separately for list view
  lastModified: number;
  lastSyncTimestamp: number | null;
  syncStatus: 'synced' | 'pending' | 'conflict' | 'local-only';
}

export interface BlueBookListing {
  listingId: string;
  category: string;
  title: string;
  url: string;
  content_excerpt?: string;
  headings?: Array<{ level: number; text: string }>;
  table_count?: number;
  is_adult_listing: boolean;
  listing_name: string;
  version?: string;
  lastUpdated?: string;
}

export interface ReportData {
  id: string;
  title: string;
  selectedBlueBookListings: string[]; // Array of listing IDs
  functionalInputs: any; // SSAFormData from ssa-form.ts
  generatedSections: any; // Map of question ID to generated text
  createdAt: number;
  lastModified: number;
}

export interface FunctionalInput {
  questionId: string;
  question: string;
  answer: string;
  severity?: 'mild' | 'moderate' | 'severe';
}

export interface GeneratedSection {
  ssaQuestionId: string;
  ssaQuestionText: string;
  userInputs: FunctionalInput[];
  generatedText: string;
  isEdited: boolean;
  generatedAt: number;
  provider: 'gemini' | 'openai' | 'claude';
}
