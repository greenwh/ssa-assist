/**
 * EncryptionService Unit Tests
 *
 * Tests for core encryption/decryption functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { EncryptionService } from '@/services/encryption/EncryptionService';

describe('EncryptionService', () => {
  let service: EncryptionService;
  const testPassphrase = 'MySecureTestPassphrase123!';
  const testData = 'Sensitive medical information that needs encryption';

  beforeEach(() => {
    service = new EncryptionService();
  });

  describe('Initialization', () => {
    it('should initialize with a passphrase and generate salt', async () => {
      const salt = await service.initialize(testPassphrase);

      expect(salt).toBeInstanceOf(Uint8Array);
      expect(salt.length).toBe(16); // 128 bits
      expect(service.isUnlocked()).toBe(true);
    });

    it('should initialize with provided salt', async () => {
      const originalSalt = await service.initialize(testPassphrase);
      service.lock();

      const newService = new EncryptionService();
      const returnedSalt = await newService.initialize(testPassphrase, originalSalt);

      expect(returnedSalt).toEqual(originalSalt);
    });

    it('should throw error when encrypting without initialization', async () => {
      await expect(service.encrypt(testData)).rejects.toThrow(
        'Encryption service not initialized'
      );
    });
  });

  describe('Encryption and Decryption', () => {
    beforeEach(async () => {
      await service.initialize(testPassphrase);
    });

    it('should encrypt data successfully', async () => {
      const encrypted = await service.encrypt(testData);

      expect(encrypted).toHaveProperty('iv');
      expect(encrypted).toHaveProperty('ciphertext');
      expect(encrypted.iv).toBeTruthy();
      expect(encrypted.ciphertext).toBeTruthy();
      expect(encrypted.ciphertext).not.toBe(testData);
    });

    it('should decrypt data successfully', async () => {
      const encrypted = await service.encrypt(testData);
      const decrypted = await service.decrypt(encrypted);

      expect(decrypted).toBe(testData);
    });

    it('should handle round-trip encryption/decryption', async () => {
      const originalData = 'Multiple rounds of test data';

      const encrypted1 = await service.encrypt(originalData);
      const encrypted2 = await service.encrypt(originalData);

      // Same data should produce different ciphertexts (unique IVs)
      expect(encrypted1.ciphertext).not.toBe(encrypted2.ciphertext);
      expect(encrypted1.iv).not.toBe(encrypted2.iv);

      // But both should decrypt to the same value
      const decrypted1 = await service.decrypt(encrypted1);
      const decrypted2 = await service.decrypt(encrypted2);

      expect(decrypted1).toBe(originalData);
      expect(decrypted2).toBe(originalData);
    });

    it('should handle encryption of empty string', async () => {
      const encrypted = await service.encrypt('');
      const decrypted = await service.decrypt(encrypted);

      expect(decrypted).toBe('');
    });

    it('should handle encryption of large data', async () => {
      const largeData = 'A'.repeat(1000000); // 1MB of data
      const encrypted = await service.encrypt(largeData);
      const decrypted = await service.decrypt(encrypted);

      expect(decrypted).toBe(largeData);
    });

    it('should handle encryption of unicode characters', async () => {
      const unicodeData = '你好世界 🔒 Здравствуй мир';
      const encrypted = await service.encrypt(unicodeData);
      const decrypted = await service.decrypt(encrypted);

      expect(decrypted).toBe(unicodeData);
    });

    it('should fail decryption with wrong key', async () => {
      const encrypted = await service.encrypt(testData);

      // Lock and reinitialize with different passphrase
      service.lock();
      await service.initialize('WrongPassphrase123!');

      await expect(service.decrypt(encrypted)).rejects.toThrow(
        'Decryption failed'
      );
    });

    it('should fail decryption with corrupted ciphertext', async () => {
      const encrypted = await service.encrypt(testData);

      // Corrupt the ciphertext
      const corrupted = {
        ...encrypted,
        ciphertext: encrypted.ciphertext.slice(0, -5) + 'XXXXX',
      };

      await expect(service.decrypt(corrupted)).rejects.toThrow();
    });
  });

  describe('Session Management', () => {
    it('should lock session and clear master key', async () => {
      await service.initialize(testPassphrase);
      expect(service.isUnlocked()).toBe(true);

      service.lock();
      expect(service.isUnlocked()).toBe(false);
    });

    it('should not allow encryption after lock', async () => {
      await service.initialize(testPassphrase);
      service.lock();

      await expect(service.encrypt(testData)).rejects.toThrow(
        'Encryption service not initialized'
      );
    });
  });

  describe('Passphrase Verification', () => {
    it('should verify correct passphrase', async () => {
      const salt = await service.initialize(testPassphrase);
      const testEncryptedData = await service.encrypt('test');

      const isValid = await service.verifyPassphrase(
        testPassphrase,
        salt,
        testEncryptedData
      );

      expect(isValid).toBe(true);
    });

    it('should reject incorrect passphrase', async () => {
      const salt = await service.initialize(testPassphrase);
      const testEncryptedData = await service.encrypt('test');

      const isValid = await service.verifyPassphrase(
        'WrongPassphrase',
        salt,
        testEncryptedData
      );

      expect(isValid).toBe(false);
    });
  });

  describe('Passphrase Strength Calculation', () => {
    it('should rate very weak passphrases as score 0', () => {
      const result = service.calculatePassphraseStrength('123');
      expect(result.score).toBe(0);
      expect(result.feedback.length).toBeGreaterThan(0);
    });

    it('should detect common patterns', () => {
      const result = service.calculatePassphraseStrength('password123');
      expect(result.score).toBeLessThan(3);
      expect(result.feedback.some((f) => f.includes('common'))).toBe(true);
    });

    it('should rate strong passphrases highly', () => {
      const result = service.calculatePassphraseStrength('MyVeryStr0ng!Passphrase2024');
      expect(result.score).toBeGreaterThanOrEqual(3);
    });

    it('should detect repeated characters', () => {
      const result = service.calculatePassphraseStrength('aaaaaa');
      expect(result.score).toBe(0);
      expect(result.feedback.some((f) => f.includes('repeated'))).toBe(true);
    });

    it('should suggest character variety', () => {
      const result = service.calculatePassphraseStrength('alllowercase');
      expect(result.feedback.some((f) => f.includes('Mix'))).toBe(true);
    });
  });

  describe('Base64 Encoding/Decoding', () => {
    beforeEach(async () => {
      await service.initialize(testPassphrase);
    });

    it('should properly encode and decode binary data', async () => {
      const testData = 'Test data with special chars: 你好 🔒';
      const encrypted = await service.encrypt(testData);

      // IV and ciphertext should be valid base64
      expect(() => atob(encrypted.iv)).not.toThrow();
      expect(() => atob(encrypted.ciphertext)).not.toThrow();

      const decrypted = await service.decrypt(encrypted);
      expect(decrypted).toBe(testData);
    });
  });

  describe('Key Derivation', () => {
    it('should derive same key from same passphrase and salt', async () => {
      const salt = await service.initialize(testPassphrase);
      const encrypted1 = await service.encrypt(testData);

      service.lock();
      await service.initialize(testPassphrase, salt);
      const encrypted2 = await service.encrypt(testData);

      // Should be able to decrypt each other's ciphertext
      const decrypted1 = await service.decrypt(encrypted1);
      const decrypted2 = await service.decrypt(encrypted2);

      expect(decrypted1).toBe(testData);
      expect(decrypted2).toBe(testData);
    });

    it('should derive different keys from different salts', async () => {
      const salt1 = await service.initialize(testPassphrase);
      const encrypted1 = await service.encrypt(testData);

      service.lock();

      const salt2 = await service.initialize(testPassphrase);
      expect(salt2).not.toEqual(salt1);

      // Should NOT be able to decrypt with different salt
      await expect(service.decrypt(encrypted1)).rejects.toThrow();
    });
  });
});
