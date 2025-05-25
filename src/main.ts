import express from 'express';

import { authMiddleware } from './modules/auth/middleware/auth';
//import { adminMiddleware } from './modules/admin/middleware/index';
import authRoutes from './modules/auth/routes';
//import adminRoutes from './modules/admin/routes';
import { errorHandler } from './core/middleware/error-handler';

const app = express();
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api', authMiddleware);

// Admin routes
//app.use('/api/admin', adminMiddleware, adminRoutes);

// Global Error Handler - MUST be after all routes and other middleware
// Error handling middleware must be registered with all 4 parameters
app.use(errorHandler);

// Start server
const PORT = parseInt(process.env.PORT || '3000');
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

