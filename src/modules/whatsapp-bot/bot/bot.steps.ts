import { botMessages } from "./bot.messages";
import type { BotSessionData } from "./bot.types";
import { sendTextMessage } from "../services/whatsapp-cloud.service";
import { createWhatsAppAppointment } from "../services/whatsapp-appointment.service";
import {
  closeSession,
  updateSession,
} from "../services/whatsapp-session.service";
import type { SessionLike } from "./bot.types";

/**
 * Get the data from the session.
 * @param session - The session data with the phone and workshopId
 * @returns The data from the session.
 */
function getData(session: SessionLike): BotSessionData {
  if (session.data && typeof session.data === "object") {
    return session.data as BotSessionData;
  }
  return {};
}

/**
 * Handle the menu step. If the user selects the option to schedule an appointment,
 * the bot will update the session to the next step and send the next message.
 * @param session - The session data with the phone and workshopId
 * @param text - The text message received. It should be the option selected by the user.
 * @returns void. It will send the next message to the user.
 */
export async function handleMenu(session: SessionLike, text: string) {
  const choice = text.trim();

  if (choice !== "1") {
    await sendTextMessage({
      to: session.phone,
      body: botMessages.opcionInvalida(),
    });
    return;
  }

  await updateSession(
    session.id,
    session.version,
    "esperando_nombre",
    getData(session),
  );
  await sendTextMessage({ to: session.phone, body: botMessages.pedirNombre() });
}

/**
 * Handle the name step. If the user provides the name, the bot will update the session to the next step and send the next message.
 * @param session - The session data with the phone and workshopId
 * @param text - The text message received. It should be the name provided by the user.
 * @returns void. It will send the next message to the user.
 */
export async function handleNombre(session: SessionLike, text: string) {
  const nombre = text.trim();
  const data = { ...getData(session), nombre };

  await updateSession(session.id, session.version, "esperando_vehiculo", data);
  await sendTextMessage({
    to: session.phone,
    body: botMessages.pedirVehiculo(),
  });
}

/**
 * Handle the vehicle step. If the user provides the vehicle, the bot will update the session to the next step and send the next message.
 * @param session - The session data with the phone and workshopId
 * @param text - The text message received. It should be the vehicle provided by the user.
 * @returns void. It will send the next message to the user.
 */
export async function handleVehiculo(session: SessionLike, text: string) {
  const vehiculo = text.trim();
  const data = { ...getData(session), vehiculo };

  await updateSession(session.id, session.version, "esperando_fecha", data);
  await sendTextMessage({ to: session.phone, body: botMessages.pedirFecha() });
}

/**
 * Handle the date step. If the user provides the date, the bot will update the session to the next step and send the next message.
 * @param session - The session data with the phone and workshopId
 * @param text - The text message received. It should be the date provided by the user.
 * @returns void. It will send the next message to the user.
 */
export async function handleFecha(session: SessionLike, text: string) {
  const fecha = text.trim();
  const data = { ...getData(session), fecha };

  await updateSession(session.id, session.version, "confirmando", data);
  await sendTextMessage({
    to: session.phone,
    body: botMessages.resumenConfirmacion(data),
  });
}

/**
 * Handle the confirmation step. If the user confirms the appointment, the bot will create the appointment and send the next message.
 * @param session - The session data with the phone and workshopId
 * @param text - The text message received. It should be the confirmation provided by the user.
 * @returns void. It will send the next message to the user.
 */
export async function handleConfirmacion(session: SessionLike, text: string) {
  const answer = text.trim().toUpperCase();
  const data = getData(session);

  // If the user cancels the appointment, update the session to the menu step and send the next message.
  if (answer === "N") {
    await updateSession(session.id, session.version, "menu", {});
    await sendTextMessage({
      to: session.phone,
      body: botMessages.citaCancelada(),
    });
    return;
  }

  // If the user does not confirm the appointment, send the invalid option message.
  if (answer !== "S") {
    await sendTextMessage({
      to: session.phone,
      body: botMessages.opcionInvalida(),
    });
    return;
  }

  // Create the appointment
  await createWhatsAppAppointment({
    workshopId: session.workshopId,
    phone: session.phone,
    customerName: data.nombre ?? "",
    vehicleText: data.vehiculo ?? "",
    desiredDateTime: data.fecha ?? "",
  });

  // Close the session and send the confirmation message
  await closeSession(session.id, session.version);
  await sendTextMessage({
    to: session.phone,
    body: botMessages.citaConfirmada(),
  });
}
