import { Request, Response } from 'express';
import * as moveService from '../services/move';

export const getMovesByPokemon = async (req: Request, res: Response) => {
  try {
    const moves = await moveService.getMovesByPokemon(req.params.id);
    res.json(moves);
  } catch (error) {
    console.error('Error in getMovesByPokemon: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};