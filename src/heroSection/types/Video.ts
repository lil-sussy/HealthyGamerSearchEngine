export interface Occurrence {
  quote: string;
  url: string;
  rank: number;
  distance: number;
  timestamp: number;
  duration: number;
}

export interface Video {
  video_id: string;
  duration: number;
  occurrences: Occurrence[];
} 