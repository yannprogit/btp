import { Router } from 'express';
import * as pokemonController from '../controllers/pokemon';

const router = Router();

/**
 * @openapi
 * /pokemons:
 *   get:
 *     summary: Get a paginated list of Pokemons.
 *     security: []
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Pagination offset, default is 0.
 *     responses:
 *       200:
 *         description: List of Pokemons with max page info.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 maxPage:
 *                   type: integer
 *                   example: 66
 *                   description: Maximum number of pages available.
 *                 pokemons:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "1"
 *                       name:
 *                         type: string
 *                         example: "bulbasaur"
 *                       types:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               example: "grass"
 *                       sprite:
 *                         type: string
 *                         format: uri
 *                         example: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
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
router.get('/', pokemonController.getPokemons);

export default router;
