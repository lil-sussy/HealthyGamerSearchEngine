// Import necessary packages
import { env } from "@/env";
import { ChromaClient, Collection } from "chromadb";
import { COLORS, logger } from "../logger/logger";
import { enhanceQueryKeywords, queryPreProcessing } from "./nlpServices";
import { chatCompletion, getEmbeddingsOpenai } from "./aiServices";
import { getVideoDuration } from "./videoServices";
import { type VideoData } from "../types/video";
import { type ChromaQueryResult } from "../types/video";
import { drkSystemPrompt } from "../prompts/drkSystemPrompt";

// Initialize ChromaDB client
const chromaClient = new ChromaClient({
  path: env.CHROMA_SERVER_URL,
});

// Collection references
let collectionVideos: Collection;
let collectionKeywords: Collection;

/**
 * Initialize ChromaDB collections
 */
export async function initializeCollections(): Promise<void> {
  try {
    collectionVideos = await chromaClient.getOrCreateCollection({
      name: "video_embeddings",
    });
    
    collectionKeywords = await chromaClient.getOrCreateCollection({
      name: "keywords_embeddings",
    });
    
    logger.info("ChromaDB collections initialized successfully");
  } catch (error) {
    logger.error(`Failed to initialize collections: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

/**
 * Process a query and return relevant video data
 * 
 * @param query - The user's search query
 * @param usePrediction - Whether to use AI prediction to enhance the query
 * @returns A tuple of [VideoData array, AI response]
 */
export async function querying(
  query: string,
  usePrediction: boolean = true,
): Promise<[VideoData[], string]> {
  logger.info(`${COLORS.WHITE}Querying AI with query: ${COLORS.BLUE}${query}${COLORS.RESET}`);
  
  try {
    // Process and enhance the query
    const preProcessedQuery = queryPreProcessing(query);
    const enhancedQuery = await enhanceQueryKeywords(collectionKeywords, preProcessedQuery);
    
    // Get AI response for the query
    const chatResponse = await chatCompletion(drkSystemPrompt, enhancedQuery);
    
    // Get embeddings for the query or AI response
    const queryToEmbed = usePrediction ? chatResponse : preProcessedQuery;
    const embeddingResponse = await getEmbeddingsOpenai(queryToEmbed);
    
    if (!embeddingResponse) {
      throw new Error("Failed to generate embeddings for query");
    }
    
    // Query the video collection with embeddings
    const results = await queryChromaDB(embeddingResponse);
    
    // Process results into video data
    if (!results) {
      throw new Error("No results found in the database");
    }
    const videoData = await processQueryResults(results);
    
    logger.info(`Query returned ${videoData.length} videos`);
    return [videoData, chatResponse];
  } catch (error) {
    logger.error(`Error querying AI: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

/**
 * Query ChromaDB with embeddings
 */
async function queryChromaDB(embedding: number[]): Promise<ChromaQueryResult> {
  const results = await collectionVideos.query({
    queryEmbeddings: [embedding],
  }) as unknown as ChromaQueryResult;
  
  if (!results.metadatas[0] || !results.documents[0] || !results.distances[0]) {
    throw new Error("No results found in ChromaDB");
  }
  
  return results;
}

/**
 * Process ChromaDB query results into structured video data
 */
async function processQueryResults(results: ChromaQueryResult): Promise<VideoData[]> {
  const videoDict: Record<string, VideoData> = {};

  if (!results.metadatas[0] || !results.documents[0] || !results.distances[0]) {
    throw new Error("No results found in database please contact me");
  }
  
  for (let i = 0; i < results.metadatas[0].length; i++) {
    const metadata = results.metadatas[0][i] as {
      video_url: string;
      timestamp: number;
      duration: number;
    };
    
    const quote = results.documents[0][i] as string;
    const distance = results.distances[0][i] as number;
    
    // Extract video ID from URL
    const videoId = metadata.video_url.split("=").pop() || "";
    
    // Calculate timestamp for video link (start 10 seconds before)
    const timestampRounded = Math.floor(metadata.timestamp);
    const videoLink = `${metadata.video_url}?&=${Math.max(0, timestampRounded - 10)}s`;
    
    // Get or create video entry
    if (!videoDict[videoId]) {
      const duration = await getVideoDuration(metadata.video_url);
      
      videoDict[videoId] = {
        video_id: videoId,
        duration,
        occurrences: [],
      };
    }
    
    // Add occurrence to video
    videoDict[videoId].occurrences.push({
      quote,
      url: videoLink,
      rank: i + 1,
      distance,
      timestamp: metadata.timestamp,
      duration: metadata.duration,
    });
  }
  
  return Object.values(videoDict);
}
