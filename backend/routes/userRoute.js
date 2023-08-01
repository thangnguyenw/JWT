import { Router } from 'express';
import userController from '../controller/userController.js';

const router = new Router();

// get all user
router.get("/", userController.getAllUsers);

// delete user 
router.delete("/:id", userController.deleteUser);

export default router;
