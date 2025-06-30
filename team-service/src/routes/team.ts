import { Router } from 'express';
import * as teamController from '../controllers/team';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.get('/', authMiddleware, teamController.getTeamsByUser);

router.get('/:id', authMiddleware, teamController.getTeamById);

router.post('/', authMiddleware, teamController.createTeam);

router.put('/:id', authMiddleware, teamController.updateTeam);

router.delete('/:id', authMiddleware, teamController.deleteTeam);

export default router;
