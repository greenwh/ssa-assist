/**
 * IndexedDBService Unit Tests
 * Tests for IndexedDB storage operations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { IndexedDBService } from '@/services/storage/IndexedDBService';

describe('IndexedDBService', () => {
  let service: IndexedDBService;

  beforeEach(async () => {
    service = new IndexedDBService();
    await service.initialize();
  });

  afterEach(async () => {
    // Clean up test data
    const db = await service['openDatabase']();
    const stores = ['config', 'reports', 'bluebook-cache'];

    for (const storeName of stores) {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.clear();
    }
  });

  describe('Initialization', () => {
    it('should initialize database successfully', async () => {
      expect(service).toBeDefined();
      const hasConfig = await service.hasConfig();
      expect(typeof hasConfig).toBe('boolean');
    });

    it('should create required object stores', async () => {
      const db = await service['openDatabase']();
      expect(db.objectStoreNames.contains('config')).toBe(true);
      expect(db.objectStoreNames.contains('reports')).toBe(true);
      expect(db.objectStoreNames.contains('bluebook-cache')).toBe(true);
    });
  });

  describe('Config Operations', () => {
    it('should detect no config on first run', async () => {
      const hasConfig = await service.hasConfig();
      expect(hasConfig).toBe(false);
    });

    it('should save and retrieve config', async () => {
      const testConfig = {
        id: 'user-config' as const,
        salt: 'test-salt',
        selectedLLM: 'gemini' as const,
        encryptedAPIKeys: {
          iv: 'test-iv',
          ciphertext: 'test-ciphertext',
        },
        encryptedModelConfigs: {
          iv: 'test-iv',
          ciphertext: 'test-ciphertext',
        },
        lastModified: Date.now(),
        testEncryptedData: {
          iv: 'test-iv',
          ciphertext: 'test-ciphertext',
        },
      };

      await service.saveConfig(testConfig);
      const retrieved = await service.getConfig();

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe('user-config');
      expect(retrieved?.salt).toBe('test-salt');
      expect(retrieved?.selectedLLM).toBe('gemini');
    });

    it('should update existing config', async () => {
      const initialConfig = {
        id: 'user-config' as const,
        salt: 'test-salt',
        selectedLLM: 'gemini' as const,
        encryptedAPIKeys: { iv: 'test-iv', ciphertext: 'test-ciphertext' },
        encryptedModelConfigs: { iv: 'test-iv', ciphertext: 'test-ciphertext' },
        lastModified: Date.now(),
        testEncryptedData: { iv: 'test-iv', ciphertext: 'test-ciphertext' },
      };

      await service.saveConfig(initialConfig);

      const updatedConfig = {
        ...initialConfig,
        selectedLLM: 'openai' as const,
        lastModified: Date.now(),
      };

      await service.saveConfig(updatedConfig);
      const retrieved = await service.getConfig();

      expect(retrieved?.selectedLLM).toBe('openai');
    });
  });

  describe('Report Operations', () => {
    it('should return empty array when no reports exist', async () => {
      const reports = await service.getAllReports();
      expect(reports).toEqual([]);
    });

    it('should save and retrieve report', async () => {
      const testReport = {
        id: 'test-report-1',
        encryptedData: { iv: 'test-iv', ciphertext: 'test-ciphertext' },
        encryptedTitle: { iv: 'test-iv', ciphertext: 'test-title' },
        lastModified: Date.now(),
        lastSyncTimestamp: null,
        syncStatus: 'local-only' as const,
      };

      await service.saveReport(testReport);
      const retrieved = await service.getReport('test-report-1');

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe('test-report-1');
    });

    it('should list all reports', async () => {
      const reports = [
        {
          id: 'report-1',
          encryptedData: { iv: 'iv-1', ciphertext: 'data-1' },
          encryptedTitle: { iv: 'iv-1', ciphertext: 'title-1' },
          lastModified: Date.now(),
          lastSyncTimestamp: null,
          syncStatus: 'local-only' as const,
        },
        {
          id: 'report-2',
          encryptedData: { iv: 'iv-2', ciphertext: 'data-2' },
          encryptedTitle: { iv: 'iv-2', ciphertext: 'title-2' },
          lastModified: Date.now(),
          lastSyncTimestamp: null,
          syncStatus: 'local-only' as const,
        },
      ];

      for (const report of reports) {
        await service.saveReport(report);
      }

      const allReports = await service.getAllReports();
      expect(allReports).toHaveLength(2);
    });

    it('should delete report', async () => {
      const testReport = {
        id: 'report-to-delete',
        encryptedData: { iv: 'test-iv', ciphertext: 'test-ciphertext' },
        encryptedTitle: { iv: 'test-iv', ciphertext: 'test-title' },
        lastModified: Date.now(),
        lastSyncTimestamp: null,
        syncStatus: 'local-only' as const,
      };

      await service.saveReport(testReport);
      await service.deleteReport('report-to-delete');

      const retrieved = await service.getReport('report-to-delete');
      expect(retrieved).toBeUndefined();
    });

    it('should return undefined for non-existent report', async () => {
      const retrieved = await service.getReport('non-existent-id');
      expect(retrieved).toBeUndefined();
    });
  });

  describe('Blue Book Cache', () => {
    it('should cache Blue Book listings', async () => {
      const testListings = [
        {
          listingId: '1.00',
          category: 'Musculoskeletal',
          title: 'Musculoskeletal Disorders',
          url: 'https://www.ssa.gov/disability/professionals/bluebook/1.00-Musculoskeletal-Adult.htm',
        },
        {
          listingId: '2.00',
          category: 'Special Senses',
          title: 'Special Senses and Speech',
          url: 'https://www.ssa.gov/disability/professionals/bluebook/2.00-SpecialSensesandSpeech-Adult.htm',
        },
      ];

      await service.cacheBlueBookListings(testListings);
      const cached = await service.getAllBlueBookListings();

      expect(cached).toHaveLength(2);
      expect(cached[0].listingId).toBe('1.00');
    });

    it('should search Blue Book listings', async () => {
      const testListings = [
        {
          listingId: '1.00',
          category: 'Musculoskeletal',
          title: 'Musculoskeletal Disorders',
          url: 'https://test.com/1.00',
        },
        {
          listingId: '5.00',
          category: 'Digestive',
          title: 'Digestive System',
          url: 'https://test.com/5.00',
        },
        {
          listingId: '12.00',
          category: 'Mental',
          title: 'Mental Disorders',
          url: 'https://test.com/12.00',
        },
      ];

      await service.cacheBlueBookListings(testListings);

      const muscleResults = await service.searchBlueBookListings('musculo');
      expect(muscleResults).toHaveLength(1);
      expect(muscleResults[0].listingId).toBe('1.00');

      const mentalResults = await service.searchBlueBookListings('mental');
      expect(mentalResults).toHaveLength(1);
      expect(mentalResults[0].listingId).toBe('12.00');

      const allResults = await service.searchBlueBookListings('');
      expect(allResults).toHaveLength(3);
    });

    it('should update cached listings', async () => {
      const initialListings = [
        {
          listingId: '1.00',
          category: 'Musculoskeletal',
          title: 'Old Title',
          url: 'https://test.com/1.00',
        },
      ];

      await service.cacheBlueBookListings(initialListings);

      const updatedListings = [
        {
          listingId: '1.00',
          category: 'Musculoskeletal',
          title: 'Updated Title',
          url: 'https://test.com/1.00',
        },
      ];

      await service.cacheBlueBookListings(updatedListings);
      const cached = await service.getAllBlueBookListings();

      expect(cached[0].title).toBe('Updated Title');
    });
  });
});
