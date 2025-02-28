
// Define interfaces for our data structures
export interface VideoOccurrence {
  quote: string;
  url: string;
  rank: number;
  distance: number;
  timestamp: number;
  duration: number;
}

export interface VideoData {
  video_id: string;
  duration: number | null;
  occurrences: VideoOccurrence[];
}

export interface EmbeddingResponse {
  data: {
    data: Array<{
      embedding: number[];
    }>;
  };
  status: number;
  statusText: string;
}

export interface ChatResponse {
  data: {
    choices: Array<{
      message: {
        content: string;
      };
    }>;
  };
  status: number;
  statusText: string;
}

export interface ChromaQueryResult {
  ids: string[][];
  embeddings: number[][][];
  documents: string[][];
  metadatas: Array<Array<{
    video_url: string;
    timestamp: number;
    duration: number;
    [key: string]: string | number;
  }>>;
  distances: number[][];
}