export type ContentId = string;

export interface Content {
  id: ContentId;
  title: string;
  year: number;
  rating: string; // "U/A 16+"
  durationLabel: string; // "48m" or "4 seasons"
  genres: string[];
  posterUrl: string;
  backdropUrl: string;
  description: string;
  progress?: number; // 0 to 1, only for "Continue Watching"
}

export interface CastMember {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
}

export interface ContentDetail extends Content {
  cast: CastMember[];
  relatedIds: ContentId[];
}

export interface Category {
  id: string;
  label: string;
}

export interface Section {
  id: string;
  title: string; // "Trending now"
  itemIds: ContentId[];
}

export interface HomeFeed {
  hero: Content;
  categories: Category[];
  sections: Section[];
}
