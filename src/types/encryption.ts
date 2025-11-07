/**
 * Encryption-related type definitions
 */

export interface EncryptedData {
  iv: string;           // Base64-encoded initialization vector
  ciphertext: string;   // Base64-encoded encrypted data
  salt?: string;        // Base64-encoded salt (only for key derivation)
}

export interface EncryptionConfig {
  algorithm: 'AES-GCM';
  keyLength: 256;
  ivLength: 12;        // 96 bits for GCM
  saltLength: 16;      // 128 bits
  pbkdf2Iterations: number; // 600,000+ recommended
}

export interface MasterKey {
  key: CryptoKey;
  derivedAt: number;   // Timestamp when key was derived
}
