import crypto from 'node:crypto';
import { env } from '../config/env.js';
const key = Buffer.from(env.MFA_ENCRYPTION_KEY, 'base64url');
export function encrypt(plainText: string) { const iv=crypto.randomBytes(12), cipher=crypto.createCipheriv('aes-256-gcm', key, iv); const ciphertext=Buffer.concat([cipher.update(plainText, 'utf8'),cipher.final()]); return [iv.toString('base64url'),ciphertext.toString('base64url'),cipher.getAuthTag().toString('base64url')].join('.'); }
export function decrypt(payload: string) { const [ivText,cipherText,tagText]=payload.split('.'); if(!ivText||!cipherText||!tagText) throw new Error('Invalid encrypted MFA secret'); const decipher=crypto.createDecipheriv('aes-256-gcm',key,Buffer.from(ivText,'base64url')); decipher.setAuthTag(Buffer.from(tagText,'base64url')); return Buffer.concat([decipher.update(Buffer.from(cipherText,'base64url')),decipher.final()]).toString('utf8'); }
