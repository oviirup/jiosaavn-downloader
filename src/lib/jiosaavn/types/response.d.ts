export type APIv4_SongResponse = {
  songs: APIv4_Song[]
}

export type APIv4_AlbumResponse = {
  id: string
  title: string
  subtitle: string
  header_desc: string
  type: string
  perma_url: string
  image: string
  language: string
  year: string
  play_count: string
  explicit_content: string
  list_count: string
  list_type: string
  list: APIv4_Song[]
  more_info: APIv4_AlbumInfo
}

export type APIv4_PlaylistResponse = APIv4_AlbumResponse & {
  more_info: APIv4_PlaylistInfo
}

export type APIv4_Song = {
  id: string
  title: string
  subtitle: string
  header_desc: string
  type: string
  perma_url: string
  image: string
  language: string
  year: string
  play_count: string
  explicit_content: string
  list_count: string
  list_type: string
  list: string
  more_info: APIv4_SongInfo
  button_tooltip_info: any[]
}

export type APIv4_SongInfo = {
  'music': string
  'album_id': string
  'album': string
  'label': string
  'label_id': string
  'origin': string
  'is_dolby_content': boolean
  '320kbps': string
  'encrypted_media_url': string
  'encrypted_cache_url': string
  'encrypted_drm_cache_url': string
  'encrypted_drm_media_url': string
  'album_url': string
  'duration': string
  'cache_state': string
  'has_lyrics': string
  'lyrics_snippet': string
  'starred': string
  'copyright_text': string
  'artistMap': APIv4_ArtistMap
  'release_date': string
  'label_url': string
  'triller_available': boolean
  'request_jiotune_flag': boolean
  'webp': string
}

export type APIv4_AlbumInfo = {
  artistMap: APIv4_ArtistMap
  song_count: string
  copyright_text: string
  is_dolby_content: boolean
  label_url: string
}

export type APIv4_PlaylistInfo = {
  uid: string
  contents: string
  is_dolby_content: boolean
  subtype: any[]
  fan_count: string
  playlist_type: string
  images: any[]
  subheading: any
  video_count: string
  artists: APIv4_Artist[]
  subtitle_desc: string[]
}

export type APIv4_ArtistMap = {
  primary_artists: APIv4_Artist[]
  featured_artists: APIv4_Artist[]
  artists: APIv4_Artist[]
}

export type APIv4_Artist = {
  id: string
  name: string
  role: string
  image: string
  type: string
  perma_url: string
}
