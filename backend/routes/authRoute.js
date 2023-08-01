import { Router } from 'express';
import authController from '../controller/authController.js';
import middlewareController from '../controller/middlewareController.js';

const router = new Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.requestToken);
router.post("/logout", middlewareController.verifyToken, authController.logout);

export default router;
