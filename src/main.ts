import express from "express";

//import adminRoutes from './modules/admin/routes';
import { errorHandler } from "./core/middleware/error-handler";
import { logger } from "./core/logger";
import { validationErrorHandler } from "./core/middleware/validation-error-handler";
import { authMiddleware } from "./modules/auth/middleware/auth";
//import { adminMiddleware } from './modules/admin/middleware/index';
import authRoutes from "./modules/auth/routes";
import workshopRoutes from "./modules/workshop/workshop.routes";

const app = express();
app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);

// Protected routes
app.use("/api", authMiddleware);

// Workshop routes (protected)
app.use("/api/workshops", workshopRoutes);

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
