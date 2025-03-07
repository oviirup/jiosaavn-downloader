import { getImageLinks } from '../helpers';
import type { ListPayload } from '../types/payload';
import type { APIv4_AlbumResponse, APIv4_PlaylistResponse } from '../types/response';
import { resolveArtistMapPayload, resolveSongPayload } from './song';

export function resolvePlaylistPayload(playlist: APIv4_PlaylistResponse): ListPayload {
  return {
    id: playlist.id,
    name: playlist.title,
    description: playlist.header_desc,
    type: playlist.type,
    year: playlist.year ? Number(playlist.year) : null,
    language: playlist.language,
    isExplicitContent: playlist.explicit_content === '1',
    url: playlist.perma_url,
    count: playlist.list_count ? Number(playlist.list_count) : playlist.list.length,
    artists: {
      all: playlist.more_info.artists?.map(resolveArtistMapPayload) || null,
    },
    image: getImageLinks(playlist.image),
    songs: (playlist.list && playlist.list?.map(resolveSongPayload)) || null,
  };
}
