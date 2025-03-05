import type { ListPayload, SongPayload } from '@/lib/jiosaavn/types/payload';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import pLimit from 'p-limit';

export async function downloadSong(song: SongPayload, signal?: AbortSignal, emit = true) {
  const mediaURL = song.media._320;
  console.log(`downloading: "${song.name}"`);
  try {
    const res = await fetch(mediaURL, { signal });
    const blob = await res.blob();
    if (emit) saveAs(blob, song.name + '.m4a');
    return blob;
  } catch {
    console.error(`error while downloading song: "${song.name}"`);
  }
}

export async function downloadList(list: ListPayload, signal?: AbortSignal) {
  const limit = pLimit(5);
  const zip = new JSZip();

  const downloadQueue = list.songs.map((song) => {
    return limit(() => downloadSong(song, signal, false));
  });

  const bufferDataList = await Promise.all(downloadQueue);

  bufferDataList.map(async (buffer, i) => {
    if (!buffer) return;
    const name = list.songs[i].name;
    const fileName = sanitizeFileName(name, '.m4a');
    zip.file(fileName, buffer, { binary: true });
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const zipFileName = sanitizeFileName(list.name, '.zip');
  saveAs(blob, zipFileName);
}

/** Sanitize the input string to be usable as filename cross-platform */
function sanitizeFileName(input: string, ext?: string) {
  if (typeof input !== 'string') {
    console.error('Input must be string');
    return null;
  }
  const sanitized = input
    .replace(/[\/\?<>\\:\*\|"]/g, '-')
    .replace(/[\x00-\x1f\x80-\x9f]/g, '-')
    .replace(/\s+/, ' ')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 255);
  return ext ? `${sanitized}${ext}` : sanitized;
}
