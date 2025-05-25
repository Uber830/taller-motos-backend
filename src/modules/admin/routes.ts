import { Router } from 'express';
import { AdminController } from './controllers/admin-controller';

const router = Router();
const adminController = new AdminController();

// Admin routes
router.post('/assign-role', adminController.assignRole);
router.delete('/users/:userId', adminController.deleteUser);
router.get('/dashboard', adminController.getDashboardStats);

export default router;
