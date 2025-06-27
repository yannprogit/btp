import { Router } from 'express';
import * as userController from '../controllers/user';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Retrieve a list of JSONPlaceholder users.
 *     description: Retrieve a list of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     security:
 *       - bearerAuth: []
 *      responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The user ID.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: Gerald
 *                       email:
 *                         type: string
 *                         description: The user's email.
 *                         example: gerald@gmail.com
 */
router.get('/', authMiddleware, userController.getUsers);

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Retrieve the currently authenticated user's profile.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user's profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Gerald
 *                 email:
 *                   type: string
 *                   example: gerald@gmail.com
 *       404:
 *         description: User not found.
 */
router.get('/me', authMiddleware, userController.getMe);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Retrieve a single user by id.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user id.
 *     responses:
 *       200:
 *         description: The user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Gerald
 *                 email:
 *                   type: string
 *                   example: gerald@gmail.com
 *       404:
 *         description: User not found.
 */
router.get('/:id', authMiddleware, userController.getUserById);

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Gerald
 *               email:
 *                 type: string
 *                 example: gerald@gmail.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Gerald
 *                 email:
 *                   type: string
 *                   example: gerald@gmail.com
 *       400:
 *         description: Missing fields in request body.
 */
router.post('/', userController.createUser);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete a user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user id.
 *     responses:
 *       204:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 */
router.delete('/:id', authMiddleware, userController.deleteUser);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Update a user's information.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user id.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alfred
 *               email:
 *                 type: string
 *                 example: alfred@gmail.com
 *               newPassword:
 *                 type: string
 *                 example: newStrongPassword
 *               currentPassword:
 *                 type: string
 *                 description: Current password for verification
 *                 example: currentPassword
 *             required:
 *               - currentPassword
 *     responses:
 *       204:
 *         description: User updated successfully.
 *       400:
 *         description: Bad request (missing currentPassword or no fields to update).
 *       403:
 *         description: Invalid credentials (currentPassword incorrect).
 */
router.put('/:id', authMiddleware, userController.updateUser);


export default router;
