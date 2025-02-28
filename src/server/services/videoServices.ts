import { logger } from "../logger/logger";
import ytdl from 'ytdl-core';


export async function getVideoDuration(videoUrl: string): Promise<number | null> {
  try {
    logger.info(`Fetching video duration for URL: ${videoUrl}`);
    const info = await ytdl.getInfo(videoUrl);
    const duration = parseInt(info.videoDetails.lengthSeconds as string);
    logger.info(`Video duration: ${duration} seconds`);
    return duration;
  } catch (e) {
    logger.error(`Error fetching video duration: ${e instanceof Error ? e.message : String(e)}`);
    return null;
  }
}