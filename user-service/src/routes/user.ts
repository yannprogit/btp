import { Router } from 'express';
import * as userController from '../controllers/user';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.get('/', authMiddleware, userController.getUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.post('/', userController.createUser);
router.delete('/:id', authMiddleware, userController.deleteUser);
router.put('/:id', authMiddleware, userController.updateUser);


export default router;
