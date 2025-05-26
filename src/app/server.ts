import express, { Express } from "express";

import { config } from "@/app/config/config";
import { logger } from "@/core/logger";

export class Server {
  private readonly app: Express;

  constructor() {
    this.app = express();
    this.app.use(express.json());
  }

  async start(): Promise<void> {
    return new Promise<void>(resolve => {
      this.app.listen(config.server.port, () => {
        const message = `Server is running on port ${config.server.port}`;
        logger.info(message);
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    return new Promise(resolve => {
      this.app.removeAllListeners();
      resolve();
    });
  }

  getApp(): Express {
    return this.app;
  }
}
