import { Router } from 'express';
import { AuthController } from './index'

const router = Router();
const authController = new AuthController();

// Route auth
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

export default router;
