import express from "express";

//import adminRoutes from './modules/admin/routes';
import { errorHandler } from "./core/middleware/error-handler";
import { logger } from "./core/logger";
import morgan from "morgan";
import cors from "cors";
import { validationErrorHandler } from "./core/middleware/validation-error-handler";
import { authMiddleware } from "./modules/auth/middleware/auth";
//import { adminMiddleware } from './modules/admin/middleware/index';
import authRoutes from "./modules/auth/routes";
import workshopRoutes from "./modules/workshop/workshop.routes";
import { userRoutes } from "./modules/user";
import { serviceRoutes } from "./modules/services";
import { workOrderRoutes } from "./modules/work-orders";
import { supplyRoutes } from "./modules/supplies";
import customerRoutes from "./modules/customer/customer.routes";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
// Routes without authentication required
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/api", authMiddleware);

// Protected routes
app.use("/api/workshops", authMiddleware, workshopRoutes);
app.use("/api/customers", authMiddleware, customerRoutes);
app.use("/api/services", authMiddleware, serviceRoutes);
app.use("/api/work-orders", authMiddleware, workOrderRoutes);
app.use("/api/supplies", authMiddleware, supplyRoutes);

// Admin routes
//app.use('/api/admin', adminMiddleware, adminRoutes);

// Global Error Handlers - MUST be after all routes and other middleware
// Validation errors should be handled first
app.use(validationErrorHandler);

// Generic error handler
app.use(errorHandler);

// Start server
const PORT = Number.parseInt(process.env.PORT ?? "3000");
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
