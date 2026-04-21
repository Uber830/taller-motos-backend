import type { BotSummaryData } from "./bot.types";

/**
 * Messages for the WhatsApp bot.
 * @property bienvenida - The welcome message.
 * @property pedirNombre - The message to ask for the name.
 * @property pedirVehiculo - The message to ask for the vehicle.
 * @property pedirFecha - The message to ask for the date.
 * @property resumenConfirmacion - The message to ask for the confirmation.
 * @property citaConfirmada - The message to confirm the appointment.
 * @property citaCancelada - The message to cancel the appointment.
 * @property citaFinalizada - The message to confirm the appointment.
 * @property errorTaller - The message to show the error of the taller.
 * @property opcionInvalida - The message to show the invalid option.
 */
export const botMessages = {
  bienvenida: (tallerNombre: string) =>
    `👋 ¡Hola! Bienvenido a *${tallerNombre}*.\n¿Qué deseas hacer?\n\n1️⃣ Agendar una cita`,

  pedirNombre: () => "¿Cuál es tu nombre completo?",

  pedirVehiculo: () =>
    "¿Cuál es la marca y modelo de tu vehículo? (ej: Honda CB 190)",

  pedirFecha: () =>
    "¿Qué fecha y hora prefieres para tu cita? (ej: Martes 21 de abril a las 10am)",

  resumenConfirmacion: (data: BotSummaryData) =>
    `✅ ¡Ya falta poco! Solo confirma estos datos:\n\n` +
    `👤 Nombre: ${data.nombre ?? "-"}\n` +
    `🏍️ Vehículo: ${data.vehiculo ?? "-"}\n` +
    `📅 Fecha: ${data.fecha ?? "-"}\n\n` +
    "¿Todo correcto? Responde *S* para confirmar o *N* para cancelar.",

  citaConfirmada: () =>
    "🎉 ¡Listo! Tu cita ha sido agendada con éxito.\nTe esperamos. Hasta pronto 👋",

  citaCancelada: () =>
    "Entendido. Cancelé la solicitud. Si quieres, escribe *1* para agendar una cita.",

  ordenFinalizada: (nombre: string, vehiculo: string) =>
    `✅ ¡Hola ${nombre}! Tu *${vehiculo}* ya está listo.\nPuedes pasar a recogerlo. ¡Gracias por confiar en nosotros! 🔧`,

  errorTaller: () =>
    "Lo sentimos, no pudimos identificar el taller. Por favor usa el link oficial del negocio.",

  opcionInvalida: () =>
    "No entendí tu respuesta. Por favor elige una opción válida del menú.",
} as const;
