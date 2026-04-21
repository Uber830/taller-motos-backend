import { prisma } from "../../../core/db/prisma";

type CreateAppointmentArgs = {
  workshopId: string;
  phone: string;
  customerName: string;
  vehicleText: string;
  desiredDateTime: string;
};

export async function createWhatsAppAppointment(args: CreateAppointmentArgs) {
  return await prisma.whatsAppAppointment.create({
    data: {
      workshopId: args.workshopId,
      phone: args.phone,
      customerName: args.customerName,
      vehicleText: args.vehicleText,
      desiredDateTime: args.desiredDateTime,
    },
  });
}
