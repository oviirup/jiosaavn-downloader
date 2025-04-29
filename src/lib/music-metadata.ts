import { ID3Writer } from 'browser-id3-writer'
import type { ImageLinks, SongPayload } from './jiosaavn/types/payload'

const ID3TAG_MAP = {
  title: 'TIT2',
  subTitle: 'TIT3',
  album: 'TALB',
  artist: 'TPE1',
  albumArtist: 'TPE2',
  track: 'TRCK',
  year: 'TYER',
  genre: 'TCON',
  language: 'TLAN',
  encoderSettings: 'TSSE',
  copyright: 'TCOP',
  publisher: 'TPUB',
  comments: 'COMM',
  lyrics: 'USLT',
  image: 'APIC',
  playCounter: 'PCNT',
  audioSourceUrl: 'WOAS',
} as const

export async function writeMusicMetadata(
  inputFile: File | Blob,
  meta: SongPayload,
): Promise<Blob> {
  // 1. Read the MP3 into an ArrayBuffer
  const buffer = await inputFile.arrayBuffer()
  const writer = new ID3Writer(buffer)

  const primaryArtists = meta.artists.primary.map((e) => e.name)
  try {
    writer.setFrame(ID3TAG_MAP.title, meta.name)
    writer.setFrame(ID3TAG_MAP.albumArtist, primaryArtists[0])
    writer.setFrame(ID3TAG_MAP.artist, primaryArtists)
    if (meta.track) writer.setFrame(ID3TAG_MAP.track, String(meta.track))
    if (meta.year) writer.setFrame(ID3TAG_MAP.year, Number(meta.year))
    // write cover image
    writer.setFrame(ID3TAG_MAP.image, {
      data: await getAlbumArt(meta.image),
      type: 3,
      description: '',
    })
    // for future references
    writer.setFrame(ID3TAG_MAP.audioSourceUrl, meta.url)
  } catch {}

  writer.addTag()
  return writer.getBlob()
}

export async function getAlbumArt(mediaImageLinks: ImageLinks) {
  try {
    const res = await fetch(mediaImageLinks._500)
    return await res.arrayBuffer()
  } catch {
    return null
  }
}
