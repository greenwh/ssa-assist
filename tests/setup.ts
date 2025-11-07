/**
 * Test setup file
 * Loaded before all test files
 */

// Mock Web Crypto API if not available
if (typeof crypto === 'undefined' || !crypto.subtle) {
  const { webcrypto } = await import('crypto');
  global.crypto = webcrypto as Crypto;
}
