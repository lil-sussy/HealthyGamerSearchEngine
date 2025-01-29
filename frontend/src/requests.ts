// Import necessary types
import type { Video } from "./types/Video";

// Initialize an in-memory cache
const cache = new Map<string, { data: any, timestamp: number }>();

// Cache expiration time in milliseconds (e.g., 5 minutes)
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000;

async function fetchData<T>(url: string, options: RequestInit = {}, useCache: boolean = true): Promise<[T | null, string | null]> {
  const cacheKey = url;
  const cached = cache.get(cacheKey);

  // Check if the cached data is still valid
  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRATION_TIME && useCache) {
    return [cached.data as T, null];
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      return [null, `Failed to fetch data (status: ${response.status})`];
    }
    const data = await response.json();

    // Store the response in the cache
    cache.set(cacheKey, { data, timestamp: Date.now() });

    return [data, null];
  } catch (error) {
    return [null, (error as unknown as Error).message];
  }
}

export async function queryVideos(query: string, idToken: string): Promise<[Video[] | null, string | null]> {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ query }),
  };
  return fetchData<Video[]>("/api/query/", options, false);
}

export async function submitFeedback(query: string, grade: number, additionalInfo: string): Promise<[any | null, string | null]> {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      grade,
      additional_information: additionalInfo,
    }),
  };
  return fetchData<any>("/api/feedback/query/", options, false);
}

export async function sendContactFeedback(name: string, email: string, message: string): Promise<[any | null, string | null]> {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, message }),
  };
  return fetchData<any>("/api/contact/feedback", options, false);
} 