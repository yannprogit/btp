import { Router } from 'express';
import * as userController from '../controllers/user';

const router = Router();

router.get('/', userController.getUsers);
router.get('/user/:id', userController.getUserById);
router.get('/addUser', userController.createUser);
router.get('/deleteUser/id', userController.deleteUser);
router.get('/updateUser', userController.updateUser);


export default router;
