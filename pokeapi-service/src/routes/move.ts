import { Router } from 'express';
import * as moveController from '../controllers/move';

const router = Router();

router.get('/:id', moveController.getMovesByPokemon);

export default router;
