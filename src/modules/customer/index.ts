export { customerController } from "./controllers/customer.controller";
export { customerMotorcycleController } from "./controllers/customer-motorcycle.controller";
export * from "./interfaces/customer.interface";
export * from "./interfaces/customer-motorcycle.interface";
export * from "./services/customer.service";
export * from "./services/customer-motorcycle.service";
export * from "./validators/customer.validator";
export * from "./validators/customer-motorcycle.validator";
export { default as customerRoutes } from "./customer.routes";

// Module documentation
export const CUSTOMER_MODULE_INFO = {
    name: "Customer Management",
    version: "1.0.0",
    description: "Gestión completa de clientes y motocicletas para talleres de motos",
    endpoints: {
        customers: "/api/customers",
        motorcycles: "/api/customers/:customerId/motorcycles",
        stats: "/api/customers/stats"
    }
}; 