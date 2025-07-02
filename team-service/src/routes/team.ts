import { Router } from 'express';
import * as teamController from '../controllers/team';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

/**
 * @openapi
 * /teams:
 *   get:
 *     summary: Get all teams belonging to the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of teams.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   name:
 *                     type: string
 *                     example: "PokeTeam"
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing or invalid token
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/', authMiddleware, teamController.getTeamsByUser);

/**
 * @openapi
 * /teams/{id}:
 *   get:
 *     summary: Get a team by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     responses:
 *       200:
 *         description: Team data.
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
 *                   example: "PokeTeam"
 *                 userId:
 *                   type: string
 *                   example: "1"
 *                 pokemons:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       speciesId:
 *                         type: integer
 *                         example: 25
 *                       name:
 *                         type: string
 *                         example: "Mr Pika"
 *                       sprite:
 *                         type: string
 *                         format: uri
 *                         example: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
 *                       types:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               example: "electric"
 *                       moves:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             name:
 *                               type: string
 *                               example: "thunderbolt"
 *                             accuracy:
 *                               type: integer
 *                               example: 100
 *                             damage:
 *                               type: integer
 *                               example: 90
 *                             description:
 *                               type: string
 *                               example: "Inflicts regular damage.  Has a 10% chance to paralyze the target."
 *                             type:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                   example: "electric"
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing or invalid token
 *       404:
 *         description: Team not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Team not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/:id', authMiddleware, teamController.getTeamById);

/**
 * @openapi
 * /teams:
 *   post:
 *     summary: Create a new team.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "PokeTeam"
 *               pokemons:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     speciesId:
 *                       type: integer
 *                       example: 25
 *                     name:
 *                       type: string
 *                       example: "Mr Pika"
 *                     sprite:
 *                       type: string
 *                       format: uri
 *                       example: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
 *                     types:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "electric"
 *                     moves:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "thunderbolt"
 *                           accuracy:
 *                             type: integer
 *                             example: 100
 *                           damage:
 *                             type: integer
 *                             example: 90
 *                           description:
 *                             type: string
 *                             example: "Inflicts regular damage.  Has a 10% chance to paralyze the target."
 *                           type:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: "electric"
 *     responses:
 *       201:
 *         description: Team created successfully.
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
 *                   example: "PokeTeam"
 *                 userId:
 *                   type: string
 *                   example: "1"
 *                 pokemons:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       speciesId:
 *                         type: integer
 *                         example: 25
 *                       name:
 *                         type: string
 *                         example: "Mr Pika"
 *                       sprite:
 *                         type: string
 *                         format: uri
 *                         example: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
 *                       types:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               example: "electric"
 *                       moves:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             name:
 *                               type: string
 *                               example: "thunderbolt"
 *                             accuracy:
 *                               type: integer
 *                               example: 100
 *                             damage:
 *                               type: integer
 *                               example: 90
 *                             description:
 *                               type: string
 *                               example: "Inflicts regular damage.  Has a 10% chance to paralyze the target."
 *                             type:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                   example: "electric"
 *       400:
 *         description: Name is missing in request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Name are missing
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/', authMiddleware, teamController.createTeam);

/**
 * @openapi
 * /teams/{id}:
 *   put:
 *     summary: Update a team's information.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Team Name"
 *               pokemons:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     speciesId:
 *                       type: integer
 *                       example: 25
 *                     name:
 *                       type: string
 *                       example: "Mr Pika"
 *                     sprite:
 *                       type: string
 *                       format: uri
 *                       example: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
 *                     types:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "electric"
 *                     moves:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: "thunderbolt"
 *                           accuracy:
 *                             type: integer
 *                             example: 100
 *                           damage:
 *                             type: integer
 *                             example: 90
 *                           description:
 *                             type: string
 *                             example: "Inflicts regular damage.  Has a 10% chance to paralyze the target."
 *                           type:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: "electric"
 *     responses:
 *       204:
 *         description: Team updated successfully (no content).
 *       400:
 *         description: Team name is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Team name is required
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing or invalid token
 *       404:
 *         description: Team not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Team not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.put('/:id', authMiddleware, teamController.updateTeam);

/**
 * @openapi
 * /teams/{id}:
 *   delete:
 *     summary: Delete a team by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     responses:
 *       204:
 *         description: Team deleted successfully (no content).
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing or invalid token
 *       404:
 *         description: Team not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Team not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.delete('/:id', authMiddleware, teamController.deleteTeam);

export default router;
