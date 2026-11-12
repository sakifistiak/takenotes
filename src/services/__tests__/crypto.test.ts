import { describe, expect, it } from 'vitest';
import { decryptText, encryptText } from '../crypto';

describe('Web Crypto AES-GCM Note Encryption', () => {
  it('encrypts and successfully decrypts English & Bangla text with the correct password', async () => {
    const original = 'গোপন নোট — Secret Password is P@ssw0rd123! এবং আরও কিছু তথ্য';
    const password = 'my-super-secret-key-2026';

    const payload = await encryptText(original, password);
    expect(payload.ciphertext).toBeDefined();
    expect(payload.iv).toBeDefined();
    expect(payload.salt).toBeDefined();
    expect(payload.ciphertext).not.toBe(original);

    const decrypted = await decryptText(payload, password);
    expect(decrypted).toBe(original);
  });

  it('fails decryption with wrong password', async () => {
    const original = 'Secret Note';
    const payload = await encryptText(original, 'correct-pass');

    await expect(decryptText(payload, 'wrong-pass')).rejects.toThrow();
  });
});
