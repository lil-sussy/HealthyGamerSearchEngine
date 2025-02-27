import winston from "winston";
import { type TransformableInfo } from "logform";

export const enum COLORS {
  WHITE = "\x1b[37m",
  BLUE = "\x1b[34m",
  ITALIC = "\x1b[3m",
  RESET = "\x1b[0m",
}

// Configure logging with winston
const { createLogger, format, transports } = winston;
const { combine, timestamp, colorize, printf } = format;

const logFormat = printf((info: TransformableInfo) => {
  const { level, message } = info;
  const timestamp = new Date().toISOString();
  return `${timestamp} - ${level}: ${message as string}`;
});

export const logger = createLogger({
  level: 'debug',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [new transports.Console()],
});

// Disable propagation equivalent
logger.silent = false;