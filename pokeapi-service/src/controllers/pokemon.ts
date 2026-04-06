import { NextFunction, Request, Response } from 'express';
import * as pokemonService from '../services/pokemon';

export const getPokemons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const offset = parseInt(req.query.offset as string) || 0;

    const pokemons = await pokemonService.getPokemons(offset);
    res.json(pokemons);
  } catch (error) {
    next(error);
  }
};