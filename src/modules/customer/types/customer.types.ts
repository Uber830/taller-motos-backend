import { z } from "zod";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "../validators/customer.validator";
import { VehicleType } from "./customer-vehicle.types";
import { OrderStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { OrderPriority } from "../../work-orders/types/work-order.types";

/**
 * DTOs for customer management
 * @module customer/interfaces/customer
 * @category Interfaces
 */

export type CreateCustomerDto = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerDto = z.infer<typeof updateCustomerSchema>;

export interface CustomerFilters {
  search?: string;
  page: number;
  limit: number;
}

export interface CustomerStats {
  totalCustomers: number;
  customersWithVehicles: number;
  customersWithWorkOrders: number;
  averageVehiclesPerCustomer: number;
  recentCustomers: number; // Last 30 days
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  mileage: number;
  color: string;
  type: VehicleType;
}

export interface WorkOrder {
  id: string;
  status: OrderStatus;
  priority: OrderPriority | null;
  workshopId: string;
  customerId: string;
  vehicleId: string;
  serviceId: string;
  mechanic: string;
  description: string;
  additionalNotes: string | null;
  subtotal: Decimal;
  total: Decimal;
  startDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerWithVehiclesAndWorkOrders {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  address: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  vehicles: Vehicle[];
  workOrders: WorkOrder[];
}
