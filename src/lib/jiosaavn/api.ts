import { resolveAlbumPayload } from './resolvers/album';
import { resolveSongPayload } from './resolvers/song';
import type { APIv4_AlbumResponse, APIv4_SongResponse } from './types/response';

type RequestParam = Record<string, string>;
async function requestJioSaavnApi<T = unknown>(params: RequestParam) {
  const url = new URL('https://www.jiosaavn.com/api.php');

  // construct search params
  const searchParams = {
    __call: 'webapi.get',
    _format: 'json',
    _marker: '0',
    p: 1,
    n: -1, // to get all items for playlists and album
    api_version: '4',
    ctx: 'web6dot0',
    ...params,
  };
  // append all search params to base url
  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.append(key, String(value));
  }
  const res = await fetch(url.toString());
  const data = await res.json();
  return { data: data as T, ok: res.ok };
}

type GetSongParams = { token: string };
/** Get song data from server */
export async function getSongData({ token }: GetSongParams) {
  const { data } = await requestJioSaavnApi<APIv4_SongResponse>({ token, type: 'song' });
  if (!data.songs?.length) {
    console.error('JSDX: unable to get song data');
    // TODO more detailed error handling
    return [];
  }
  return resolveSongPayload(data.songs[0]);
}

type GetListParams = { token: string; type: 'album' | 'playlist' };
/** Get song data from server */
export async function getListData({ token, type }: GetListParams) {
  const { data } = await requestJioSaavnApi<APIv4_AlbumResponse>({ token, type });
  if (!data.list?.length) {
    console.error('JSDX: unable to get song data');
    // TODO more detailed error handling
    return [];
  }
  return resolveAlbumPayload(data);
}
