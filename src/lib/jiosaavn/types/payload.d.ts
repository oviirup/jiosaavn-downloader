export type SongPayload = {
  id: string;
  name: string;
  type: string;
  track?: number | null;
  year?: string | null;
  releaseDate?: string | null;
  duration?: number | null;
  label?: string | null;
  isExplicitContent: boolean;
  isHD: boolean;
  language: string;
  url: string;
  copyright?: string | null;
  album: {
    id?: string | null;
    name?: string | null;
    url?: string | null;
  };
  artists: {
    primary?: ArtistMapPayload[] | null;
    featured?: ArtistMapPayload[] | null;
    all?: ArtistMapPayload[] | null;
  };
  media: MediaLinksPayload | null;
};

export type ArtistMapPayload = {
  id: string;
  name: string;
  role: string;
  type: string;
  url: string;
};

export type MediaLinksPayload = {
  _48: string;
  _96: string;
  _160: string;
  _320: string;
};
