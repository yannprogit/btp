import { Router } from 'express';
import * as pokemonController from '../controllers/pokemon';

const router = Router();

router.get('/', pokemonController.getPokemons);

export default router;
