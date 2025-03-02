import crypto from 'node-forge';
import type { MediaLinksPayload } from './types/payload';

export function getMediaLinks(encryptedMediaUrl: string): MediaLinksPayload | null {
  if (!encryptedMediaUrl) return null;
  // decryption constants
  const key = '38346591';
  const iv = '00000000';
  // decrypt encrypted media url
  const encrypted = crypto.util.decode64(encryptedMediaUrl);
  const decipher = crypto.cipher.createDecipher('DES-ECB', crypto.util.createBuffer(key));
  decipher.start({ iv: crypto.util.createBuffer(iv) });
  decipher.update(crypto.util.createBuffer(encrypted));
  decipher.finish();
  const link = decipher.output.getBytes();
  // construct media links payload
  return {
    _48: link.replace(/_96.mp4$/, `_48.mp4`),
    _96: link.replace(/_96.mp4$/, `_96.mp4`),
    _160: link.replace(/_96.mp4$/, `_160.mp4`),
    _320: link.replace(/_96.mp4$/, `_320.mp4`),
  };
}
