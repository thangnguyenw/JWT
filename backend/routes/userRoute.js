import { Router } from 'express';
import userController from '../controller/userController.js';
import middlewareController from '../controller/middlewareController.js';

const router = new Router();

// get all user
router.get("/", middlewareController.verifyToken, userController.getAllUsers);

// delete user 
router.delete("/:id", middlewareController.verifyTokenAndAdminAuth, userController.deleteUser);

export default router;
