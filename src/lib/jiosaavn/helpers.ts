import crypto from 'node-forge'
import type { ImageLinks, MediaLinks } from './types/payload'

export function getMediaLinks(encryptedMediaUrl: string): MediaLinks | null {
  if (!encryptedMediaUrl) return null
  // decryption constants
  const key = '38346591'
  const iv = '00000000'
  // decrypt encrypted media url
  const encrypted = crypto.util.decode64(encryptedMediaUrl)
  const decipher = crypto.cipher.createDecipher(
    'DES-ECB',
    crypto.util.createBuffer(key),
  )
  decipher.start({ iv: crypto.util.createBuffer(iv) })
  decipher.update(crypto.util.createBuffer(encrypted))
  decipher.finish()
  const link = decipher.output.getBytes().replace('http://', 'https://')
  const regexp = /_96.mp4$/
  // construct media links payload
  return {
    _48: link.replace(regexp, `_48.mp4`),
    _96: link.replace(regexp, `_96.mp4`),
    _160: link.replace(regexp, `_160.mp4`),
    _320: link.replace(regexp, `_320.mp4`),
  }
}

export function getImageLinks(imageUrl: string): ImageLinks {
  if (!imageUrl) return null
  const link = imageUrl.replace(/^http:\/\//, 'https://')
  const regexp = /150x150|50x50/
  // construct image links payload
  return {
    _50: link.replace(regexp, '50x50'),
    _150: link.replace(regexp, '150x150'),
    _500: link.replace(regexp, '500x500'),
  }
}

const parser = new DOMParser()
export function decodeHtmlEntities(html: string) {
  if (!html) return
  const doc = parser.parseFromString(html, 'text/html')
  return doc.documentElement.textContent
}
