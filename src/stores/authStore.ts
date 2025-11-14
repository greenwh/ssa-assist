/**
 * Authentication State Management
 * Manages session state and encryption initialization
 */

import { create } from 'zustand';
import { encryptionService } from '@/services/encryption/EncryptionService';
import { indexedDBService } from '@/services/storage/IndexedDBService';
import type { UserConfig } from '@/types/storage';

interface AuthState {
  isInitialized: boolean;
  isUnlocked: boolean;
  isFirstTimeSetup: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  setupPassphrase: (passphrase: string) => Promise<void>;
  unlock: (passphrase: string) => Promise<boolean>;
  lock: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isInitialized: false,
  isUnlocked: false,
  isFirstTimeSetup: false,
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true, error: null });

      // Initialize IndexedDB
      await indexedDBService.initialize();

      // Check if this is first-time setup
      const hasConfig = await indexedDBService.hasConfig();
      set({
        isFirstTimeSetup: !hasConfig,
        isInitialized: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Failed to initialize application',
        isLoading: false,
      });
    }
  },

  setupPassphrase: async (passphrase: string) => {
    try {
      set({ isLoading: true, error: null });

      // Initialize encryption service with new passphrase
      const salt = await encryptionService.initialize(passphrase);

      // Create test encrypted data for passphrase verification
      const testEncryptedData = await encryptionService.encrypt('test');

      // Save configuration
      const config: UserConfig = {
        id: 'user-config',
        salt: btoa(String.fromCharCode(...salt)),
        selectedLLM: 'gemini',
        encryptedAPIKeys: await encryptionService.encrypt(JSON.stringify({})),
        encryptedModelConfigs: await encryptionService.encrypt(
          JSON.stringify({
            gemini: 'gemini-2.0-flash-exp',
            openai: 'gpt-4o-mini',
            claude: 'claude-sonnet-4-5-20250929',
            xai: 'grok-beta',
          })
        ),
        lastModified: Date.now(),
        testEncryptedData,
      };

      await indexedDBService.saveConfig(config);

      // Cache Blue Book data
      const baseUrl = import.meta.env.BASE_URL || '/';
      const bluebookDataRaw = await fetch(`${baseUrl}data/bluebook/ssa_bluebook_adult_complete.json`.replace('//', '/')).then(
        (r) => r.json()
      );

      // Transform data to match TypeScript interface
      const bluebookData = bluebookDataRaw.map((item: any) => ({
        listingId: item.listing_id,
        category: item.listing_id.split('.')[0], // Extract category from listing_id (e.g., "1" from "1.00")
        title: item.title,
        url: item.url,
        content_excerpt: item.content_excerpt,
        headings: item.headings,
        table_count: item.table_count,
        is_adult_listing: item.is_adult_listing,
        listing_name: item.listing_name,
      }));

      await indexedDBService.cacheBlueBookListings(bluebookData);

      set({
        isFirstTimeSetup: false,
        isUnlocked: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: 'Failed to setup passphrase',
        isLoading: false,
      });
    }
  },

  unlock: async (passphrase: string) => {
    try {
      set({ isLoading: true, error: null });

      // Get user config
      const config = await indexedDBService.getConfig();
      if (!config) {
        set({ error: 'No configuration found', isLoading: false });
        return false;
      }

      // Convert salt from base64
      const salt = Uint8Array.from(atob(config.salt), (c) => c.charCodeAt(0));

      // Verify passphrase
      const isValid = await encryptionService.verifyPassphrase(
        passphrase,
        salt,
        config.testEncryptedData
      );

      if (!isValid) {
        set({ isLoading: false });
        return false;
      }

      // Initialize encryption service
      await encryptionService.initialize(passphrase, salt);

      // Check if Blue Book data is cached, if not, load it
      const cachedListings = await indexedDBService.getAllBlueBookListings();
      if (cachedListings.length === 0) {
        try {
          const baseUrl = import.meta.env.BASE_URL || '/';
          const bluebookDataRaw = await fetch(`${baseUrl}data/bluebook/ssa_bluebook_adult_complete.json`.replace('//', '/')).then(
            (r) => r.json()
          );

          // Transform data to match TypeScript interface
          const bluebookData = bluebookDataRaw.map((item: any) => ({
            listingId: item.listing_id,
            category: item.listing_id.split('.')[0],
            title: item.title,
            url: item.url,
            content_excerpt: item.content_excerpt,
            headings: item.headings,
            table_count: item.table_count,
            is_adult_listing: item.is_adult_listing,
            listing_name: item.listing_name,
          }));

          await indexedDBService.cacheBlueBookListings(bluebookData);
        } catch (error) {
          console.error('Failed to load Blue Book data:', error);
        }
      }

      set({
        isUnlocked: true,
        isLoading: false,
      });

      return true;
    } catch (error) {
      set({
        error: 'Failed to unlock',
        isLoading: false,
      });
      return false;
    }
  },

  lock: () => {
    encryptionService.lock();
    set({
      isUnlocked: false,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Listen for session lock events
if (typeof window !== 'undefined') {
  window.addEventListener('session-locked', () => {
    useAuthStore.getState().lock();
  });
}
