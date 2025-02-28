import axios, { type AxiosResponse } from 'axios';
import { COLORS, logger } from '../logger/logger';
import { env } from '@/env';

const openaiApiKey = env.OPENAI_API_KEY || '';
const openrouterApiKey = env.OPENROUTER_API_KEY || '';

export async function getEmbeddingsOpenai(texts: string): Promise<number[] | null> {
  const headers = {
    'Authorization': `Bearer ${openaiApiKey}`,
    'Content-Type': 'application/json'
  };
  const url = "https://api.openai.com/v1/embeddings";
  const payload = {
    "input": texts,
    "model": "text-embedding-3-small"
  };

  try {
    logger.info(`${COLORS.WHITE}Requesting embeddings for texts: ${COLORS.BLUE}${texts}${COLORS.RESET}`);
    const response = (await axios.post(url, payload, { headers })) as AxiosResponse<{
      data: Array<{
        embedding: number[];
      }>;
    }>;
    return response.data.data[0]!.embedding;
  } catch (e) {
    logger.error(`Error fetching embeddings from OpenAI: ${e instanceof Error ? e.message : String(e)}`);
    throw e;
  }
}

export async function chatCompletion(systemPrompt: string, query: string): Promise<string> {
  const headers = {
    'Authorization': `Bearer ${openrouterApiKey}`,
    'Content-Type': 'application/json'
  };
  const url = "https://openrouter.ai/api/v1/chat/completions";
  const payload = {
    "model": "deepseek/deepseek-chat",
    "messages": [{ "role": "system", "content": systemPrompt }, { "role": "user", "content": query }]
  };
  
  try {
    const response = await axios.post(url, payload, { headers: headers });
    return response.data.choices[0].message.content as string;
  } catch (e) {
    logger.error(`Error fetching chat completion from OpenAI: ${e instanceof Error ? e.message : String(e)}`);
    throw e;
  }
}