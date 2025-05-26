/**
 * Logger service for the application.
 * In production, you might want to replace this with a more robust solution like Winston or Pino.
 */
export const logger = {
  error: (message: string, error?: unknown): void => {
    // In production, you might want to send this to an error tracking service
    const errorDetails = error instanceof Error ? error.stack : error;
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`, errorDetails);
  },

  warn: (message: string, ...args: unknown[]): void => {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${message}`, ...args);
  },

  info: (message: string, ...args: unknown[]): void => {
    // eslint-disable-next-line no-console
    console.log(`[INFO] ${message}`, ...args);
  },

  debug: (message: string, ...args: unknown[]): void => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
};
