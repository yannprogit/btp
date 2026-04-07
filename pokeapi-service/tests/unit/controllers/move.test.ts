import { NextFunction, Request, Response } from 'express';
import { getMovesByPokemon } from '../../../src/controllers/move';
import * as moveService from '../../../src/services/move';

jest.mock('p-limit', () => {
  return () => (fn: any) => fn();
});
jest.mock('../../../src/services/move');

describe('move controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return moves from service', async () => {
    const req = {
      params: { id: '1' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
    const next = jest.fn() as unknown as NextFunction;

    const payload = [
      {
        id: '1',
        name: 'pound',
        damage: 40,
        accuracy: 100,
        description: 'Inflicts regular damage.',
        type: { name: 'normal' }
      }
    ];

    (moveService.getMovesByPokemon as jest.Mock).mockResolvedValue(payload);

    await getMovesByPokemon(req, res, next);

    expect(moveService.getMovesByPokemon).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith(payload);
    expect(res.status).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('should forward error to next when service throws', async () => {
    const req = {
      params: { id: '1' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;
    const next = jest.fn() as unknown as NextFunction;

    const serviceError = new Error('service error');
    (moveService.getMovesByPokemon as jest.Mock).mockRejectedValue(serviceError);

    await getMovesByPokemon(req, res, next);

    expect(next).toHaveBeenCalledWith(serviceError);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
