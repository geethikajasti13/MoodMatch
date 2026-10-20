export type ContentType = 'book' | 'movie' | 'series';

export type Intensity = 'light' | 'moderate' | 'intense';

export interface ContentRecord {
  _id: string;
  title: string;
  type: ContentType;
  contentType?: ContentType;      // Backend field
  creator: string;                // author or director or showrunner
  platform?: string;              // Backend platform/publisher
  year: number;
  genres: string[];
  moods: string[];                // experiential moods this matches
  experiences?: string[];         // Backend experiences tags
  intensity: Intensity | 'low' | 'medium' | 'high';
  description: string;
  themes: string[];
  coverUrl: string;
  posterUrl?: string;             // Backend posterUrl
  externalUrl?: string;           // Backend external link
  isNetflixOriginal?: boolean;    // Backend Netflix Original indicator
  runtimeNote: string;            // e.g. "320 pages" or "2h 22m" or "3 seasons"
  source: string;                 // attribution of cover image or source
  bookCount?: number;             // for series
  matchScore?: number;            // Backend relevance score
  matchReason?: string;           // Backend explanation of match
}

export interface MoodInterpretation {
  primaryMoods: string[];
  detectedThemes: string[];
  intensity: Intensity | 'low' | 'medium' | 'high';
  toneSummary: string;
  keywords: string[];
}
