import { Request, Response } from 'express';
import * as pokemonService from '../services/pokemon';

export const getPokemons = async (req: Request, res: Response) => {
  try {
    const offset = parseInt(req.query.offset as string) || 0;

    const pokemons = await pokemonService.getPokemons(offset);
    res.json(pokemons);
  } catch (err) {
    console.error('Error in getPokemons: ', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};