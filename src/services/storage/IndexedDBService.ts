/**
 * IndexedDBService - Local database management
 *
 * Manages three object stores:
 * 1. config - User configuration, salt, encrypted API keys
 * 2. reports - Encrypted report data with metadata
 * 3. bluebook-cache - Cached Blue Book listings for offline use
 */

import { openDB, type IDBPDatabase } from 'idb';
import type {
  UserConfig,
  Report,
  BlueBookListing,
} from '@/types/storage';

const DB_NAME = 'SSAFormAssist';
const DB_VERSION = 1;

export class IndexedDBService {
  private db: IDBPDatabase | null = null;

  /**
   * Initialize the database and create object stores
   */
  async initialize(): Promise<void> {
    this.db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Store 1: User configuration
        if (!db.objectStoreNames.contains('config')) {
          db.createObjectStore('config', { keyPath: 'id' });
        }

        // Store 2: Reports
        if (!db.objectStoreNames.contains('reports')) {
          const reportStore = db.createObjectStore('reports', { keyPath: 'id' });
          reportStore.createIndex('lastModified', 'lastModified', { unique: false });
          reportStore.createIndex('syncStatus', 'syncStatus', { unique: false });
        }

        // Store 3: Blue Book cache
        if (!db.objectStoreNames.contains('bluebook-cache')) {
          const bluebookStore = db.createObjectStore('bluebook-cache', {
            keyPath: 'listingId',
          });
          bluebookStore.createIndex('category', 'category', { unique: false });
          bluebookStore.createIndex('listing_name', 'listing_name', { unique: false });
        }
      },
    });
  }

  private ensureDB(): IDBPDatabase {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  // ==================== CONFIG OPERATIONS ====================

  /**
   * Save user configuration
   */
  async saveConfig(config: UserConfig): Promise<void> {
    const db = this.ensureDB();
    await db.put('config', config);
  }

  /**
   * Get user configuration
   */
  async getConfig(): Promise<UserConfig | undefined> {
    const db = this.ensureDB();
    return await db.get('config', 'user-config');
  }

  /**
   * Check if user config exists (for first-time setup detection)
   */
  async hasConfig(): Promise<boolean> {
    const config = await this.getConfig();
    return config !== undefined;
  }

  // ==================== REPORT OPERATIONS ====================

  /**
   * Save a report
   */
  async saveReport(report: Report): Promise<void> {
    const db = this.ensureDB();
    await db.put('reports', {
      ...report,
      lastModified: Date.now(),
    });
  }

  /**
   * Get a report by ID
   */
  async getReport(id: string): Promise<Report | undefined> {
    const db = this.ensureDB();
    return await db.get('reports', id);
  }

  /**
   * Get all reports (sorted by last modified, descending)
   */
  async getAllReports(): Promise<Report[]> {
    const db = this.ensureDB();
    const tx = db.transaction('reports', 'readonly');
    const index = tx.store.index('lastModified');
    const reports = await index.getAll();

    // Sort descending (most recent first)
    return reports.reverse();
  }

  /**
   * Delete a report
   */
  async deleteReport(id: string): Promise<void> {
    const db = this.ensureDB();
    await db.delete('reports', id);
  }

  /**
   * Get reports by sync status
   */
  async getReportsBySyncStatus(
    status: 'synced' | 'pending' | 'conflict' | 'local-only'
  ): Promise<Report[]> {
    const db = this.ensureDB();
    const tx = db.transaction('reports', 'readonly');
    const index = tx.store.index('syncStatus');
    return await index.getAll(status);
  }

  /**
   * Update report sync status
   */
  async updateReportSyncStatus(
    id: string,
    syncStatus: 'synced' | 'pending' | 'conflict' | 'local-only',
    syncTimestamp?: number
  ): Promise<void> {
    const db = this.ensureDB();
    const report = await this.getReport(id);

    if (!report) {
      throw new Error(`Report ${id} not found`);
    }

    await db.put('reports', {
      ...report,
      syncStatus,
      lastSyncTimestamp: syncTimestamp || report.lastSyncTimestamp,
    });
  }

  // ==================== BLUE BOOK CACHE OPERATIONS ====================

  /**
   * Cache Blue Book listings (for offline use)
   */
  async cacheBlueBookListings(listings: BlueBookListing[]): Promise<void> {
    const db = this.ensureDB();
    const tx = db.transaction('bluebook-cache', 'readwrite');

    for (const listing of listings) {
      await tx.store.put(listing);
    }

    await tx.done;
  }

  /**
   * Get all cached Blue Book listings
   */
  async getAllBlueBookListings(): Promise<BlueBookListing[]> {
    const db = this.ensureDB();
    return await db.getAll('bluebook-cache');
  }

  /**
   * Get Blue Book listings by category
   */
  async getBlueBookListingsByCategory(category: string): Promise<BlueBookListing[]> {
    const db = this.ensureDB();
    const tx = db.transaction('bluebook-cache', 'readonly');
    const index = tx.store.index('category');
    return await index.getAll(category);
  }

  /**
   * Get a specific Blue Book listing
   */
  async getBlueBookListing(listingId: string): Promise<BlueBookListing | undefined> {
    const db = this.ensureDB();
    return await db.get('bluebook-cache', listingId);
  }

  /**
   * Search Blue Book listings by name
   */
  async searchBlueBookListings(query: string): Promise<BlueBookListing[]> {
    const db = this.ensureDB();
    const allListings = await db.getAll('bluebook-cache');

    const lowercaseQuery = query.toLowerCase();
    return allListings.filter(
      (listing) =>
        listing.listing_name.toLowerCase().includes(lowercaseQuery) ||
        listing.title.toLowerCase().includes(lowercaseQuery) ||
        listing.content_excerpt?.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Clear all data (for testing or reset)
   */
  async clearAllData(): Promise<void> {
    const db = this.ensureDB();
    const tx = db.transaction(['config', 'reports', 'bluebook-cache'], 'readwrite');

    await Promise.all([
      tx.objectStore('config').clear(),
      tx.objectStore('reports').clear(),
      tx.objectStore('bluebook-cache').clear(),
    ]);

    await tx.done;
  }

  /**
   * Export all data (for backup)
   */
  async exportAllData(): Promise<{
    config?: UserConfig;
    reports: Report[];
    bluebookCache: BlueBookListing[];
  }> {
    return {
      config: await this.getConfig(),
      reports: await this.getAllReports(),
      bluebookCache: await this.getAllBlueBookListings(),
    };
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Export singleton instance
export const indexedDBService = new IndexedDBService();
