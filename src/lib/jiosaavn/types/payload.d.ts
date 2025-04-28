export type SongPayload = {
  id: string
  name: string
  type: string
  track?: number | null
  year?: string | null
  releaseDate?: string | null
  duration?: number | null
  label?: string | null
  isExplicitContent: boolean
  isHD: boolean
  language: string
  url: string
  copyright?: string | null
  album: {
    id?: string | null
    name?: string | null
    url?: string | null
  }
  artists: {
    primary?: ArtistMapPayload[] | null
    featured?: ArtistMapPayload[] | null
    all?: ArtistMapPayload[] | null
  }
  image: ImageLinks | null
  media: MediaLinks | null
}

export type ListPayload = {
  id: string
  name: string
  description: string
  type: string
  year: number
  language: string
  isExplicitContent: boolean
  url: string
  count: number
  artists: {
    primary?: ArtistMapPayload[] | null
    featured?: ArtistMapPayload[] | null
    all?: ArtistMapPayload[] | null
  }
  image: ImageLinks
  songs: SongPayload[]
}

export type ArtistMapPayload = {
  id: string
  name: string
  role: string
  type: string
  url: string
}

export type ImageLinks = {
  _50: string
  _150: string
  _500: string
}

export type MediaLinks = {
  _48: string
  _96: string
  _160: string
  _320: string
}
