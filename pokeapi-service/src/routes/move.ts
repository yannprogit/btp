import { Router } from 'express';
import * as moveController from '../controllers/move';

const router = Router();

/**
 * @openapi
 * /move/{id}:
 *   get:
 *     summary: Get moves by Pokemon ID
 *     security: []
 *     description: Retrieve a list of moves for a given Pokemon.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pokemon ID to fetch moves for
 *     responses:
 *       200:
 *         description: List of moves of the Pokemon
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
 *                     example: "pound"
 *                   damage:
 *                     type: integer
 *                     example: 40
 *                   accuracy:
 *                     type: integer
 *                     example: 100
 *                   description:
 *                     type: string
 *                     example: "Inflicts regular damage."
 *                   type:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "normal"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/:id', moveController.getMovesByPokemon);

export default router;
