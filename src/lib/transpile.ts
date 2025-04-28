import { Mp3Encoder } from '@breezystack/lamejs'

const BASE16_MIN = -32768
const BASE16_MAX = 32767
const MP3_FRAME_SIZE = 1152

/**
 * Converts a normalized float audio sample to a clamped 16-bit signed integer.
 *
 * The input sample is expected to be between -1.0 and 1.0. The output will be a
 * signed 16-bit integer value between -32768 and 32767.
 *
 * @param sample - A single normalized float audio sample (-1.0 to 1.0).
 * @returns The corresponding clamped 16-bit signed integer value.
 */
function normalizeToInt16(sample: number): number {
  return Math.max(BASE16_MIN, Math.min(BASE16_MAX, sample * BASE16_MAX))
}

/**
 * Converts an M4A file to MP3 using
 * [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext)
 * and [lamejs](https://www.npmjs.com/package/@breezystack/lamejs)
 *
 * @param inputFile The input M4A file
 * @returns The resulting MP3 file as a Blob
 */
export async function transpile(inputFile: File | Blob): Promise<Blob> {
  const arrayBuffer = await inputFile.arrayBuffer()
  const audioContext = new AudioContext()

  const audioBuffer = await new Promise<AudioBuffer>((resolve, reject) => {
    audioContext.decodeAudioData(
      arrayBuffer,
      (buffer) => resolve(buffer),
      (error) => reject(error),
    )
  })

  const samples = audioBuffer.getChannelData(0)
  const sampleRate = audioBuffer.sampleRate

  // TODO make the bitrate dynamic, and user configurable
  const encoder = new Mp3Encoder(1, sampleRate, 320)
  const data: Uint8Array[] = []

  for (let i = 0; i < samples.length; i += MP3_FRAME_SIZE) {
    const chunk = samples.subarray(i, i + MP3_FRAME_SIZE)
    const int16 = new Int16Array(chunk.length)
    for (let j = 0; j < chunk.length; j++) {
      int16[j] = normalizeToInt16(chunk[j])
    }
    const mp3buf = encoder.encodeBuffer(int16)
    if (mp3buf.length > 0) {
      data.push(mp3buf)
    }
  }

  const finalBuf = encoder.flush()
  if (finalBuf.length > 0) {
    data.push(finalBuf)
  }

  return new Blob(data, { type: 'audio/mpeg' })
}
