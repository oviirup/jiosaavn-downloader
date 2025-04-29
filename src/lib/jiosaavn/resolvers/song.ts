import { decodeHtmlEntities, getImageLinks, getMediaLinks } from '../helpers'
import type { ArtistMapPayload, SongPayload } from '../types/payload'
import type { APIv4_Artist, APIv4_Song } from '../types/response'

export function resolveSongPayload(
  song: APIv4_Song,
  track?: number,
): SongPayload {
  return {
    id: song.id,
    name: decodeHtmlEntities(song.title),
    type: song.type,
    track: track ? track + 1 : null,
    year: song.year || null,
    releaseDate: song.more_info?.release_date || null,
    duration: song.more_info?.duration
      ? Number(song.more_info?.duration)
      : null,
    label: decodeHtmlEntities(song.more_info?.label) || null,
    isExplicitContent: song.explicit_content === '1',
    isHD: song.more_info['320kbps'] === 'true',
    language: song.language,
    url: song.perma_url,
    copyright: decodeHtmlEntities(song.more_info?.copyright_text) || null,
    album: {
      id: song.more_info?.album_id || null,
      name: decodeHtmlEntities(song.more_info?.album) || null,
      url: song.more_info?.album_url || null,
    },
    artists: {
      primary: song.more_info?.artistMap?.primary_artists?.map((artist) => {
        return resolveArtistMapPayload(artist)
      }),
      featured: song.more_info?.artistMap?.featured_artists?.map((artist) => {
        return resolveArtistMapPayload(artist)
      }),
      all: song.more_info?.artistMap?.artists?.map((artist) => {
        return resolveArtistMapPayload(artist)
      }),
    },
    image: getImageLinks(song.image),
    media: getMediaLinks(song.more_info?.encrypted_media_url),
  }
}

export function resolveArtistMapPayload(
  artist: APIv4_Artist,
): ArtistMapPayload {
  return {
    id: artist.id,
    name: decodeHtmlEntities(artist.name),
    role: artist.role,
    type: artist.type,
    url: artist.perma_url,
  }
}
