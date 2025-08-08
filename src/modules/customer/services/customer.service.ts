import { PrismaClient } from "@prisma/client";
import {
    CreateCustomerDto,
    UpdateCustomerDto,
    CustomerFilters,
    CustomerStats,
    CustomerWithVehicles,
} from "../interfaces/customer.interface";
import {
    ConflictError,
    NotFoundError,
    ForbiddenError,
    BadRequestError,
} from "../../../core/errors";

/**
 * Service for customer management
 * @module customer/service
 * @category Services
 */

const prisma = new PrismaClient();

export class CustomerService {
    /**
     * Gets the workshop ID for a given user ID.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<string>} The workshop ID.
     * @throws {NotFoundError} If the user doesn't own a workshop.
     */
    private async getWorkshopIdByUserId(userId: string): Promise<string> {
        const workshop = await prisma.workshop.findUnique({
            where: { ownerId: userId },
            select: { id: true },
        });

        if (!workshop) {
            throw new NotFoundError("Workshop not found for this user");
        }

        return workshop.id;
    }

    /**
     * Validates if the user has access to the customer.
     * @param {string} customerId - The ID of the customer.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<void>}
     * @throws {ForbiddenError} If the user doesn't have access.
     */
    private async validateCustomerAccess(
        customerId: string,
        userId: string,
    ): Promise<void> {
        const workshopId = await this.getWorkshopIdByUserId(userId);

        const customer = await prisma.customer.findFirst({
            where: {
                id: customerId,
                workshopId,
            },
        });

        if (!customer) {
            throw new ForbiddenError("Customer not found in your workshop");
        }
    }

    /**
     * Creates a new customer for a workshop.
     * @param {string} userId - The ID of the user creating the customer.
     * @param {CreateCustomerDto} customerData - The customer data.
     * @returns {Promise<CustomerWithVehicles>} The created customer.
     * @throws {ConflictError} If a customer with the same phone already exists.
     */
    async createCustomer(
        userId: string,
        customerData: CreateCustomerDto,
    ): Promise<CustomerWithVehicles> {
        const workshopId = await this.getWorkshopIdByUserId(userId);

        // Check for conflicts if phone or email is being created
        if (customerData.phone) {
            const existingCustomer = await prisma.customer.findFirst({
                where: {
                    workshopId,
                    phone: customerData.phone,
                },
            });

            if (existingCustomer) {
                throw new ConflictError(
                    "A customer with this phone number already exists in your workshop",
                );
            }
        }

        if (customerData.email) {
            const existingCustomer = await prisma.customer.findFirst({
                where: {
                    workshopId,
                    email: customerData.email
                },
            });

            if (existingCustomer) {
                throw new ConflictError(
                    "A customer with this email already exists in your workshop",
                );
            }
        }

        // Create the customer
        const customer = await prisma.customer.create({
            data: {
                ...customerData,
                workshop: {
                    connect: { id: workshopId },
                },
            },
            include: {
                motorcycles: {
                    select: {
                        id: true,
                        brand: true,
                        model: true,
                        year: true,
                        plate: true,
                        color: true,
                    },
                },
                _count: {
                    select: {
                        motorcycles: true,
                        workOrders: true,
                    },
                },
            },
        });

        return customer as CustomerWithVehicles;
    }

    /**
     * Gets all customers for the workshop where the user belongs.
     * @returns {Promise<{customers: CustomerWithVehicles[]}>} The customers.
     */
    async getCustomersByWorkshop(userId: string): Promise<{
        customers: CustomerWithVehicles[];
    }> {
        const workshopId = await this.getWorkshopIdByUserId(userId);

        const customers = await prisma.customer.findMany({
            where: {
                workshopId: workshopId,
            },
            include: {
                motorcycles: {
                    select: {
                        id: true,
                        brand: true,
                        model: true,
                        year: true,
                        plate: true,
                        color: true,
                    },
                },
                _count: {
                    select: {
                        motorcycles: true,
                        workOrders: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return {
            customers: customers as CustomerWithVehicles[],
        };
    }

    /**
     * Gets a specific customer by ID.
     * @param {string} customerId - The ID of the customer.
     * @returns {Promise<CustomerWithVehicles | null>} The customer or null if not found.
     */
    async getCustomerById(customerId: string): Promise<CustomerWithVehicles | null> {
        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
            include: {
                motorcycles: {
                    select: {
                        id: true,
                        brand: true,
                        model: true,
                        year: true,
                        plate: true,
                        color: true,
                    },
                },
                _count: {
                    select: {
                        motorcycles: true,
                        workOrders: true,
                    },
                },
            },
        });

        return customer as CustomerWithVehicles | null;
    }

    /**
     * Updates a customer.
     * @param {string} customerId - The ID of the customer to update.
     * @param {string} userId - The ID of the user performing the update.
     * @param {UpdateCustomerDto} customerData - The data to update.
     * @returns {Promise<CustomerWithVehicles>} The updated customer.
     * @throws {ForbiddenError} If the user doesn't have access to the customer.
     * @throws {ConflictError} If the phone or email already exists.
     */
    async updateCustomer(
        customerId: string,
        userId: string,
        customerData: UpdateCustomerDto,
    ): Promise<CustomerWithVehicles> {
        await this.validateCustomerAccess(customerId, userId);

        const workshopId = await this.getWorkshopIdByUserId(userId);

        // Check for conflicts if phone or email is being updated
        if (customerData.phone) {
            const existingCustomer = await prisma.customer.findFirst({
                where: {
                    workshopId,
                    phone: customerData.phone,
                    id: { not: customerId },
                },
            });

            if (existingCustomer) {
                throw new ConflictError(
                    "A customer with this phone number already exists in your workshop",
                );
            }
        }

        if (customerData.email) {
            const existingCustomer = await prisma.customer.findFirst({
                where: {
                    workshopId,
                    email: customerData.email,
                    id: { not: customerId },
                },
            });

            if (existingCustomer) {
                throw new ConflictError(
                    "A customer with this email already exists in your workshop",
                );
            }
        }

        const customer = await prisma.customer.update({
            where: { id: customerId },
            data: customerData,
            include: {
                motorcycles: {
                    select: {
                        id: true,
                        brand: true,
                        model: true,
                        year: true,
                        plate: true,
                        color: true,
                    },
                },
                _count: {
                    select: {
                        motorcycles: true,
                        workOrders: true,
                    },
                },
            },
        });

        return customer as CustomerWithVehicles;
    }

    /**
     * Deletes a customer.
     * @param {string} customerId - The ID of the customer to delete.
     * @param {string} userId - The ID of the user performing the deletion.
     * @returns {Promise<void>}
     * @throws {ForbiddenError} If the user doesn't have access to the customer.
     * @throws {BadRequestError} If the customer has associated work orders.
     */
    async deleteCustomer(customerId: string, userId: string): Promise<void> {
        await this.validateCustomerAccess(customerId, userId);

        // Check if customer has work orders
        const customerWithWorkOrders = await prisma.customer.findUnique({
            where: { id: customerId },
            include: {
                _count: {
                    select: {
                        workOrders: true,
                    },
                },
            },
        });

        if (customerWithWorkOrders && customerWithWorkOrders._count.workOrders > 0) {
            throw new BadRequestError(
                "Cannot delete customer with associated work orders",
            );
        }

        // Delete customer and all associated motorcycles
        await prisma.customer.delete({
            where: { id: customerId },
        });
    }

    /**
     * Gets customer statistics for a workshop.
     * @param {string} userId - The ID of the user.
     * @returns {Promise<CustomerStats>} The customer statistics.
     */
    async getCustomerStats(userId: string): Promise<CustomerStats> {
        const workshopId = await this.getWorkshopIdByUserId(userId);

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [
            totalCustomers,
            customersWithVehicles,
            customersWithWorkOrders,
            recentCustomers,
            totalVehicles,
        ] = await Promise.all([
            prisma.customer.count({
                where: { workshopId },
            }),
            prisma.customer.count({
                where: {
                    workshopId,
                    motorcycles: {
                        some: {},
                    },
                },
            }),
            prisma.customer.count({
                where: {
                    workshopId,
                    workOrders: {
                        some: {},
                    },
                },
            }),
            prisma.customer.count({
                where: {
                    workshopId,
                    createdAt: {
                        gte: thirtyDaysAgo,
                    },
                },
            }),
            prisma.motorcycle.count({
                where: {
                    customer: {
                        workshopId,
                    },
                },
            }),
        ]);

        const averageVehiclesPerCustomer =
            totalCustomers > 0 ? totalVehicles / totalCustomers : 0;

        return {
            totalCustomers,
            customersWithVehicles,
            customersWithWorkOrders,
            averageVehiclesPerCustomer: Math.round(averageVehiclesPerCustomer * 100) / 100,
            recentCustomers,
        };
    }
}

export const customerService = new CustomerService(); 