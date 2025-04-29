import { decodeHtmlEntities, getImageLinks } from '../helpers'
import type { ListPayload } from '../types/payload'
import type { APIv4_AlbumResponse } from '../types/response'
import { resolveArtistMapPayload, resolveSongPayload } from './song'

export function resolveAlbumPayload(album: APIv4_AlbumResponse): ListPayload {
  return {
    id: album.id,
    name: decodeHtmlEntities(album.title),
    description: decodeHtmlEntities(album.header_desc),
    type: album.type,
    year: album.year ? Number(album.year) : null,
    language: album.language,
    isExplicitContent: album.explicit_content === '1',
    url: album.perma_url,
    count: album.more_info.song_count
      ? Number(album.more_info.song_count)
      : album.list.length,
    artists: {
      primary: album.more_info?.artistMap?.primary_artists?.map((artist) => {
        return resolveArtistMapPayload(artist)
      }),
      featured: album.more_info?.artistMap?.featured_artists?.map((artist) => {
        return resolveArtistMapPayload(artist)
      }),
      all: album.more_info?.artistMap?.artists?.map((artist) => {
        return resolveArtistMapPayload(artist)
      }),
    },
    image: getImageLinks(album.image),
    songs: album.list ? album.list?.map(resolveSongPayload) : null,
  }
}
