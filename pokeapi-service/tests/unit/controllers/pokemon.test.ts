import { NextFunction, Request, Response } from 'express';
import { getPokemons } from '../../../src/controllers/pokemon';
import * as pokemonService from '../../../src/services/pokemon';

jest.mock('../../../src/services/pokemon');

describe('pokemon controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return pokemons from service', async () => {
    const req = {
      query: { offset: '20' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
    const next = jest.fn() as unknown as NextFunction;

    const payload = {
      maxPage: 2,
      pokemons: [{ id: '1', name: 'bulbasaur', types: [{ name: 'grass' }], sprite: 'sprite' }]
    };

    (pokemonService.getPokemons as jest.Mock).mockResolvedValue(payload);

    await getPokemons(req, res, next);

    expect(pokemonService.getPokemons).toHaveBeenCalledWith(20);
    expect(res.json).toHaveBeenCalledWith(payload);
    expect(res.status).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('should default offset to 0 when query is invalid', async () => {
    const req = {
      query: { offset: 'abc' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
    const next = jest.fn() as unknown as NextFunction;

    (pokemonService.getPokemons as jest.Mock).mockResolvedValue({ maxPage: 0, pokemons: [] });

    await getPokemons(req, res, next);

    expect(pokemonService.getPokemons).toHaveBeenCalledWith(0);
    expect(next).not.toHaveBeenCalled();
  });

  it('should forward error to next when service throws', async () => {
    const req = {
      query: {}
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
    const next = jest.fn() as unknown as NextFunction;

    const serviceError = new Error('service error');
    (pokemonService.getPokemons as jest.Mock).mockRejectedValue(serviceError);

    await getPokemons(req, res, next);

    expect(next).toHaveBeenCalledWith(serviceError);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
