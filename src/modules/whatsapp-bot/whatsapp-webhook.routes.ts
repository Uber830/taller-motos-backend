import { Router } from "express";

import {
  receiveWhatsAppWebhookController,
  verifyWhatsAppWebhookController,
} from "./controllers/whatsapp-webhook.controller";

const router = Router();

router.get("/", verifyWhatsAppWebhookController);
router.post("/", receiveWhatsAppWebhookController);

export default router;
