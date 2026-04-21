import type { BotSessionData, BotStep } from "../bot/bot.types";
import { logger } from "../../../core/logger";
import { prisma } from "../../../core/db/prisma";

const DEFAULT_SESSION_TTL_MS = 48 * 60 * 60 * 1000;

/**
 * Get the active WhatsApp session for a given phone number.
 * @param phone - The phone number of the user.
 * @returns The active session or null if no session is found or the session is expired.
 */
export async function getActiveSession(phone: string) {
  const session = await prisma.whatsAppSession.findFirst({
    where: { phone, completedAt: null },
  });

  if (!session) return null;

  const ttlMs = Number.parseInt(process.env.WA_SESSION_TTL_MS ?? "", 10);
  const sessionTtlMs = Number.isFinite(ttlMs) ? ttlMs : DEFAULT_SESSION_TTL_MS;

  if (Date.now() - session.lastMessageAt.getTime() > sessionTtlMs) {
    await closeSession(session.id, Number(session.version));
    return null;
  }

  return session;
}

/**
 * Create a new WhatsApp session.
 * @param phone - The phone number of the user.
 * @param workshopId - The ID of the workshop.
 * @returns The created session.
 */
export async function createSession(phone: string, workshopId: string) {
  return await prisma.whatsAppSession.create({
    data: {
      phone,
      workshopId,
      step: "menu",
      data: {},
      lastMessageAt: new Date(),
    },
  });
}

/**
 * Update a WhatsApp session.
 * @param sessionId - The ID of the session.
 * @param expectedVersion - The expected version of the session.
 * @param step - The step to update the session to.
 * @param data - The data to update the session with.
 * @returns void. It will update the session if the version is correct.
 */
export async function updateSession(
  sessionId: string,
  expectedVersion: number,
  step: BotStep,
  data: BotSessionData,
) {
  const result = await prisma.whatsAppSession.updateMany({
    where: {
      id: sessionId,
      completedAt: null,
      version: expectedVersion,
    },
    data: {
      step,
      data,
      lastMessageAt: new Date(),
      version: { increment: 1 },
    },
  });

  if (result.count !== 1) {
    logger.warn("WhatsApp session update conflict", {
      sessionId,
      expectedVersion,
      step,
    });
  }

  return result.count === 1;
}

/**
 * Complete a WhatsApp session.
 * @param sessionId - The ID of the session.
 * @param expectedVersion - The expected version of the session.
 * @returns void. It will complete the session if the version is correct.
 */
export async function closeSession(sessionId: string, expectedVersion: number) {
  const result = await prisma.whatsAppSession.updateMany({
    where: {
      id: sessionId,
      completedAt: null,
      version: expectedVersion,
    },
    data: {
      step: "completado",
      completedAt: new Date(),
      lastMessageAt: new Date(),
      version: { increment: 1 },
    },
  });

  if (result.count !== 1) {
    logger.warn("WhatsApp session close conflict", {
      sessionId,
      expectedVersion,
    });
  }

  return result.count === 1;
}
