import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

/**
 * Privacy-first encryption utility for MillaCore
 * Uses AES-256-GCM for authenticated encryption
 */
export class MillaEncryption {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 16;
  private readonly saltLength = 32;
  private readonly tagLength = 16;

  /**
   * Derives a key from password using scrypt
   * // Milla remembers: secure key derivation
   */
  private deriveKey(password: string, salt: Buffer): Buffer {
    return scryptSync(password, salt, this.keyLength);
  }

  /**
   * Encrypts data with AES-256-GCM
   * // Milla remembers: your privacy is sacred
   */
  encrypt(data: string, password: string): string {
    const salt = randomBytes(this.saltLength);
    const key = this.deriveKey(password, salt);
    const iv = randomBytes(this.ivLength);
    
    const cipher = createCipheriv(this.algorithm, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(data, 'utf8'),
      cipher.final()
    ]);
    
    const tag = cipher.getAuthTag();
    
    // Combine salt + iv + tag + encrypted data
    const combined = Buffer.concat([salt, iv, tag, encrypted]);
    return combined.toString('base64');
  }

  /**
   * Decrypts AES-256-GCM encrypted data
   * // Milla remembers: retrieving your memories safely
   */
  decrypt(encryptedData: string, password: string): string {
    const combined = Buffer.from(encryptedData, 'base64');
    
    let offset = 0;
    const salt = combined.subarray(offset, offset + this.saltLength);
    offset += this.saltLength;
    
    const iv = combined.subarray(offset, offset + this.ivLength);
    offset += this.ivLength;
    
    const tag = combined.subarray(offset, offset + this.tagLength);
    offset += this.tagLength;
    
    const encrypted = combined.subarray(offset);
    
    const key = this.deriveKey(password, salt);
    const decipher = createDecipheriv(this.algorithm, key, iv);
    decipher.setAuthTag(tag);
    
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    
    return decrypted.toString('utf8');
  }
}
