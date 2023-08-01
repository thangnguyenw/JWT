import { Router } from 'express';
import authController from '../controller/authController.js';

const router = new Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;
