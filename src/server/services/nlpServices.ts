// Import necessary packages
import keywordExtractor from "keyword-extractor";
import natural from "natural";
// Initialize environment variables
// Constants for console styling
import { COLORS, logger } from "../logger/logger";
import { getEmbeddingsOpenai } from "./aiServices";
import { type Collection } from "chromadb";

// Constants
const TOKENIZER = new natural.WordTokenizer();
const STEMMER = natural.PorterStemmer;
const STOPWORDS = natural.stopwords;

/**
 * Processes a search query by tokenizing, removing stopwords, and stemming
 */
export function queryPreProcessing(query: string): string {
  logger.info(`${COLORS.WHITE}Pre-processing query: ${COLORS.BLUE}${query}${COLORS.RESET}`);
  
  try {
    // Tokenization and filtering in one pass
    const filteredTokens = TOKENIZER.tokenize(query.toLowerCase())
      .filter(word => /^[a-z0-9]+$/.test(word) && !STOPWORDS.includes(word));
    
    // Stemming
    const processedQuery = filteredTokens
      .map(word => STEMMER.stem(word))
      .join(" ");
    
    logger.info(`${COLORS.WHITE}Processed query: ${COLORS.BLUE}${processedQuery}${COLORS.RESET}`);
    return processedQuery;
  } catch (error) {
    logger.error(`Error in query pre-processing: ${error instanceof Error ? error.message : String(error)}`);
    return query; // Return original query as fallback
  }
}

/**
 * Extracts keywords from text using keyword-extractor
 */
export function extractKeywords(text: string, _maxNgramSize = 3, numOfKeywords = 5): string[] {
  return keywordExtractor.extract(text, {
    language: "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  }).slice(0, numOfKeywords);
}

/**
 * Enhances a query with semantically similar keywords from the embeddings collection
 */
export async function enhanceQueryKeywords(collectionEmbeddings: Collection, query: string): Promise<string> {
  logger.info(`Enhancing query with keywords: ${query}`);
  
  try {
    // Calculate dynamic keyword count based on query length
    const keywordCount = Math.max(Math.floor(0.3 * query.split(" ").length), 8);
    const queryKeywords = extractKeywords(query, 3, keywordCount);
    
    // Get embeddings for all keywords in parallel
    const keywordEmbeddings = await Promise.all(
      queryKeywords.map(async keyword => ({
        keyword,
        embedding: await getEmbeddingsOpenai(keyword)
      }))
    );
    
    // Build enhanced query
    const queryWords = query.split(" ");
    const enhancedParts = await Promise.all(
      queryWords.map(async word => {
        const keywordData = keywordEmbeddings.find(k => k.keyword === word);
        
        if (!keywordData?.embedding) return word;
        
        // Find similar keywords
        const results = await collectionEmbeddings.query({
          queryEmbeddings: [keywordData.embedding],
          nResults: 5,
        });
        
        const similarKeywords = results.documents[0]?.filter(k => k !== null && k !== word) as string[];
        
        return similarKeywords.length > 0 
          ? `${word} ${similarKeywords.join(" ")}`
          : word;
      })
    );
    
    const enhancedQuery = enhancedParts.join(" ");
    logger.info(`Enhanced query: ${enhancedQuery}`);
    return enhancedQuery;
  } catch (error) {
    logger.error(`Error enhancing query keywords: ${error instanceof Error ? error.message : String(error)}`);
    return query; // Return original query as fallback
  }
}
