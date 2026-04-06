import { NextFunction, Request, Response } from 'express';
import * as moveService from '../services/move';

export const getMovesByPokemon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const moves = await moveService.getMovesByPokemon(req.params.id as string);
    res.json(moves);
  } catch (error) {
    next(error);
  }
};