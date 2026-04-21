import { logger } from "../../../core/logger";
import { prisma } from "../../../core/db/prisma";
import { botMessages } from "./bot.messages";
import * as steps from "./bot.steps";
import { sendTextMessage } from "../services/whatsapp-cloud.service";
import {
  createSession,
  getActiveSession,
} from "../services/whatsapp-session.service";

/**
 * Extract the workshop ID from the text.
 * @param text - The text message received. It should be the option selected by the user.
 * @returns The workshop ID.
 */
function extractWorkshopId(text: string) {
  const trimmed = text.trim();
  const match = trimmed.match(/^INICIO_(.+)$/i);
  return match?.[1] ?? null;
}

/**
 * Handle the incoming message from the WhatsApp bot.
 * @param args - The arguments object with the phone and text.
 * @returns void. It will send the next message to the user.
 */
export async function handleIncomingMessage(args: {
  phone: string;
  text: string;
}) {
  const phone = args.phone.trim();
  const text = args.text?.trim() ?? "";

  if (!phone) return;

  const session = await getActiveSession(phone);

  if (!session) {
    const workshopId = extractWorkshopId(text);
    if (!workshopId) {
      await sendTextMessage({ to: phone, body: botMessages.errorTaller() });
      return;
    }

    const workshop = await prisma.workshop.findUnique({
      where: { id: workshopId },
      select: { id: true, name: true },
    });

    if (!workshop) {
      await sendTextMessage({ to: phone, body: botMessages.errorTaller() });
      return;
    }

    await createSession(phone, workshop.id);
    await sendTextMessage({
      to: phone,
      body: botMessages.bienvenida(workshop.name),
    });
    return;
  }

  try {
    switch (session.step) {
      case "menu":
        await steps.handleMenu(session, text);
        return;
      case "esperando_nombre":
        await steps.handleNombre(session, text);
        return;
      case "esperando_vehiculo":
        await steps.handleVehiculo(session, text);
        return;
      case "esperando_fecha":
        await steps.handleFecha(session, text);
        return;
      case "confirmando":
        await steps.handleConfirmacion(session, text);
        return;
      default:
        logger.warn("Unknown WhatsApp session step", session.step);
        await sendTextMessage({
          to: phone,
          body: botMessages.opcionInvalida(),
        });
    }
  } catch (error) {
    logger.error("WhatsApp bot engine error", error);
  }
}
