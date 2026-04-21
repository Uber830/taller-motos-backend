import type { RequestHandler } from "express";

import { logger } from "../../../core/logger";
import { handleIncomingMessage } from "../bot/bot.engine";

type WhatsAppWebhookBody = {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: Array<{
          from?: string;
          text?: { body?: string };
        }>;
      };
    }>;
  }>;
};

/**
 * Verify the WhatsApp webhook.
 * It will send the challenge if the webhook is verified.
 * @returns void. It will send the status 200 if the webhook is verified.
 */
export const verifyWhatsAppWebhookController: RequestHandler = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === (process.env.WA_VERIFY_TOKEN ?? "") &&
    typeof challenge === "string"
  ) {
    res.status(200).send(challenge);
    return;
  }

  res.sendStatus(403);
};

/**
 * Receive the WhatsApp webhook.
 * It will send the status 200 if the webhook is received.
 * @returns void. It will handle the incoming message.
 */
export const receiveWhatsAppWebhookController: RequestHandler = async (
  req,
  res,
) => {
  try {
    const body = req.body as WhatsAppWebhookBody;
    const entry = body.entry?.[0]?.changes?.[0]?.value;
    const message = entry?.messages?.[0];

    if (!message) {
      res.sendStatus(200);
      return;
    }

    const phone = String(message.from ?? "").trim();
    const text = String(message.text?.body ?? "").trim();

    if (!phone) {
      res.sendStatus(200);
      return;
    }

    await handleIncomingMessage({ phone, text });
    res.sendStatus(200);
    return;
  } catch (error) {
    logger.error("Failed to process WhatsApp webhook", error);
    res.sendStatus(200);
    return;
  }
};
