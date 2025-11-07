/**
 * EncryptionService - Core security implementation
 *
 * Provides AES-256-GCM encryption with PBKDF2 key derivation.
 * Implements zero-knowledge architecture with client-side encryption only.
 *
 * Security requirements:
 * - AES-256-GCM for data encryption
 * - PBKDF2 with 600,000+ iterations for key derivation
 * - Master encryption key (MEK) stored only in memory
 * - Passphrase never stored or transmitted
 * - Unique IV for each encryption operation
 */

import type { EncryptedData, EncryptionConfig, MasterKey } from '@/types/encryption';

export class EncryptionService {
  private config: EncryptionConfig = {
    algorithm: 'AES-GCM',
    keyLength: 256,
    ivLength: 12,
    saltLength: 16,
    pbkdf2Iterations: 600000, // OWASP 2023 recommendation
  };

  private masterKey: MasterKey | null = null;
  private sessionTimeout: NodeJS.Timeout | null = null;

  /**
   * Initialize the encryption service with a passphrase
   * Derives the master key and stores it in memory
   */
  async initialize(passphrase: string, salt?: Uint8Array): Promise<Uint8Array> {
    // Generate new salt if not provided (first-time setup)
    const saltBytes = salt || this.generateSalt();

    // Derive master key from passphrase
    const key = await this.deriveKey(passphrase, saltBytes as BufferSource);

    // Store master key in memory
    this.masterKey = {
      key,
      derivedAt: Date.now(),
    };

    // Set up auto-lock timeout (30 minutes)
    this.resetSessionTimeout();

    return saltBytes;
  }

  /**
   * Generate cryptographically random salt
   */
  private generateSalt(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(this.config.saltLength));
  }

  /**
   * Derive encryption key from passphrase using PBKDF2
   */
  private async deriveKey(passphrase: string, salt: BufferSource): Promise<CryptoKey> {
    // Convert passphrase to key material
    const passphraseKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(passphrase),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    // Derive key using PBKDF2
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: this.config.pbkdf2Iterations,
        hash: 'SHA-256',
      },
      passphraseKey,
      {
        name: 'AES-GCM',
        length: this.config.keyLength,
      },
      false, // Not extractable (more secure)
      ['encrypt', 'decrypt']
    );

    return key;
  }

  /**
   * Encrypt data using AES-256-GCM
   */
  async encrypt(data: string): Promise<EncryptedData> {
    if (!this.masterKey) {
      throw new Error('Encryption service not initialized. Please unlock first.');
    }

    // Generate unique IV for this encryption operation
    const iv = crypto.getRandomValues(new Uint8Array(this.config.ivLength));

    // Encrypt the data
    const encodedData = new TextEncoder().encode(data);
    const ciphertext = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      this.masterKey.key,
      encodedData
    );

    // Return encrypted data with IV
    return {
      iv: this.arrayBufferToBase64(iv),
      ciphertext: this.arrayBufferToBase64(ciphertext),
    };
  }

  /**
   * Decrypt data using AES-256-GCM
   */
  async decrypt(encryptedData: EncryptedData): Promise<string> {
    if (!this.masterKey) {
      throw new Error('Encryption service not initialized. Please unlock first.');
    }

    // Convert base64 strings back to ArrayBuffers
    const iv = this.base64ToArrayBuffer(encryptedData.iv);
    const ciphertext = this.base64ToArrayBuffer(encryptedData.ciphertext);

    try {
      // Decrypt the data
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv as BufferSource,
        },
        this.masterKey.key,
        ciphertext as BufferSource
      );

      // Decode and return the plaintext
      return new TextDecoder().decode(decryptedData);
    } catch (error) {
      throw new Error('Decryption failed. Invalid passphrase or corrupted data.');
    }
  }

  /**
   * Lock the session - clear master key from memory
   */
  lock(): void {
    this.masterKey = null;
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }
  }

  /**
   * Check if session is unlocked
   */
  isUnlocked(): boolean {
    return this.masterKey !== null;
  }

  /**
   * Reset session timeout (called on user activity)
   */
  resetSessionTimeout(): void {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }

    // Auto-lock after 30 minutes of inactivity
    this.sessionTimeout = setTimeout(() => {
      this.lock();
      // Dispatch custom event for UI to handle
      window.dispatchEvent(new CustomEvent('session-locked'));
    }, 30 * 60 * 1000); // 30 minutes
  }

  /**
   * Verify passphrase by attempting to decrypt a test value
   */
  async verifyPassphrase(
    passphrase: string,
    salt: BufferSource,
    testEncryptedData: EncryptedData
  ): Promise<boolean> {
    try {
      // Temporarily derive key
      const tempKey = await this.deriveKey(passphrase, salt);

      const iv = this.base64ToArrayBuffer(testEncryptedData.iv);
      const ciphertext = this.base64ToArrayBuffer(testEncryptedData.ciphertext);

      // Try to decrypt test data
      await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv as BufferSource },
        tempKey,
        ciphertext as BufferSource
      );

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Utility: Convert ArrayBuffer to Base64 string
   */
  private arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
    return btoa(binary);
  }

  /**
   * Utility: Convert Base64 string to ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * Calculate passphrase strength
   * Returns score 0-4 (0=very weak, 4=very strong)
   */
  calculatePassphraseStrength(passphrase: string): {
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (passphrase.length < 8) {
      feedback.push('Use at least 8 characters');
    } else if (passphrase.length >= 12) {
      score++;
      if (passphrase.length >= 16) score++;
    }

    // Character variety
    const hasLowercase = /[a-z]/.test(passphrase);
    const hasUppercase = /[A-Z]/.test(passphrase);
    const hasNumbers = /\d/.test(passphrase);
    const hasSpecial = /[^a-zA-Z\d]/.test(passphrase);

    const varietyCount = [hasLowercase, hasUppercase, hasNumbers, hasSpecial].filter(Boolean).length;

    if (varietyCount < 3) {
      feedback.push('Mix uppercase, lowercase, numbers, and symbols');
    } else {
      score += varietyCount >= 3 ? 1 : 0;
      score += varietyCount === 4 ? 1 : 0;
    }

    // Common patterns
    if (/^(.)\1+$/.test(passphrase)) {
      feedback.push('Avoid repeated characters');
      score = 0;
    }
    if (/^(012|123|234|abc|qwerty|password)/i.test(passphrase)) {
      feedback.push('Avoid common patterns');
      score = Math.max(0, score - 2);
    }

    if (feedback.length === 0) {
      feedback.push('Strong passphrase!');
    }

    return {
      score: Math.min(4, Math.max(0, score)),
      feedback,
    };
  }
}

// Export singleton instance
export const encryptionService = new EncryptionService();
