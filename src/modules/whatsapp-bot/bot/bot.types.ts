export type BotStep =
  | "menu"
  | "esperando_nombre"
  | "esperando_vehiculo"
  | "esperando_fecha"
  | "confirmando"
  | "completado";

export type BotSessionData = {
  nombre?: string;
  vehiculo?: string;
  fecha?: string;
};

export type BotSummaryData = {
  nombre?: string;
  vehiculo?: string;
  fecha?: string;
};

export type SessionLike = {
  id: string;
  version: number;
  phone: string;
  workshopId: string;
  data: unknown;
};
