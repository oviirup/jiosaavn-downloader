import { saveAs } from '@/lib/file-saver'
import type { ListPayload, SongPayload } from '@/lib/jiosaavn/types/payload'
import { getAlbumArt, writeMusicMetadata } from '@/lib/music-metadata'
import { normalizeFileName } from '@/lib/nomalize-file-name'
import { transpile } from '@/lib/transpile'
import JSZip from 'jszip'
import pLimit from 'p-limit'

export async function downloadSong(
  song: SongPayload,
  signal?: AbortSignal,
  emit = true,
) {
  const mediaURL = song.media._320
  console.log(`downloading: "${song.name}"`)
  try {
    const res = await fetch(mediaURL, { signal })
    let blob = await res.blob()
    blob = await transpile(blob)
    blob = await writeMusicMetadata(blob, song)
    if (!emit) return blob
    saveAs(blob, `${song.name}.mp3`)
    return null
  } catch {
    console.error(`error while downloading song: "${song.name}"`)
  }
}

export async function downloadList(list: ListPayload, signal?: AbortSignal) {
  const zip = new JSZip()

  const appendSongToZip = async (song: SongPayload) => {
    const blob = await downloadSong(song, signal, false)
    const fileName = normalizeFileName(`${song.name}.mp3`)
    zip.file(fileName, blob)
  }

  // download all songs with concurrency of 5 at a time
  const limit = pLimit(5)
  const downloadQueue = list.songs.map((song) => {
    return limit(() => appendSongToZip(song))
  })
  await Promise.allSettled(downloadQueue)

  // download album cover image
  const coverImageBlob = await getAlbumArt(list.image)
  if (coverImageBlob) {
    const ext = new URL(list.image._500).pathname.replace(/.*(\.[^.]+)$/, '$1')
    const fileName = normalizeFileName(`_cover_image${ext}`)
    zip.file(fileName, coverImageBlob)
  }

  const blob = await zip.generateAsync({ type: 'blob' })
  const zipFileName = normalizeFileName(`${list.name}.zip`)
  saveAs(blob, zipFileName)
}
