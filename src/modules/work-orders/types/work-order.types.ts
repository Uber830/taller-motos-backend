import { Decimal } from "@prisma/client/runtime/library";

export enum OrderPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum OrderStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface CreateWorkOrderDto {
  customerId: string;
  vehicleId: string;
  mechanic: string;
  serviceId: string;
  priority?: OrderPriority;
  startDate?: string;
  description: string;
  additionalNotes?: string;
  supplies?: Array<{ supplyId: string; quantity: number }>;
  subtotal: number;
  total: number;
}

export interface UpdateWorkOrderDto {
  status?: OrderStatus;
  mechanic?: string;
  description?: string;
  additionalNotes?: string;
  priority?: OrderPriority;
  startDate?: string;
  subtotal?: number;
  total?: number;
}

export interface WorkOrder {
  id: string;
  status: OrderStatus;
  workshopId: string;
  customerId: string;
  vehicleId: string;
  serviceId: string;
  mechanic: string;
  description: string;
  additionalNotes: string | null;
  subtotal: Decimal;
  total: Decimal;
  createdAt: Date;
  updatedAt: Date;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  vehicle: {
    id: string;
    brand: string;
    model: string;
    mileage: number;
    year: number;
    plate: string;
    color: string;
  };
  service: {
    id: string;
    name: string;
  };
  supplies: Array<{
    id: string;
    workOrderId: string;
    supplyId: string;
    quantity: number;
    supply: {
      id: string;
      name: string;
      price: Decimal;
    };
  }>;
}
