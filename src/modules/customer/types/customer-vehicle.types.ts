import { z } from "zod";
import {
  createVehicleSchema,
  updateVehicleSchema,
} from "../validators/customer-vehicle.validator";

/**
 * DTOs for customer vehicle management
 * @module customer/interfaces/vehicle
 * @category Interfaces
 */

export type CreateVehicleDto = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleDto = z.infer<typeof updateVehicleSchema>;

export enum VehicleType {
  MOTORCYCLE = "MOTORCYCLE",
  CAR = "CAR",
}

export interface VehicleWithCustomer {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  mileage: number;
  color: string;
  type: VehicleType;
  createdAt: Date;
  updatedAt: Date;
  customer: CustomerWithId;
}

export interface CustomerWithId {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
}
