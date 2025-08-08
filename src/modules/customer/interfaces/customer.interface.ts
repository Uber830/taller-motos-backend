import { z } from "zod";
import {
    createCustomerSchema,
    updateCustomerSchema,
} from "../validators/customer.validator";

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

export interface CustomerWithVehicles {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string;
    address: string | null;
    createdAt: Date;
    updatedAt: Date;
    motorcycles: {
        id: string;
        brand: string;
        model: string;
        year: number;
        plate: string;
        color: string;
    }[];
    _count: {
        motorcycles: number;
        workOrders: number;
    };
} 