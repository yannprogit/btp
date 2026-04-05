import { Request, Response } from 'express';
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

    await getMovesByPokemon(req, res);

    expect(moveService.getMovesByPokemon).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith(payload);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 500 when service throws', async () => {
    const req = {
      params: { id: '1' }
    } as unknown as Request;

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as unknown as Response;

    (moveService.getMovesByPokemon as jest.Mock).mockRejectedValue(new Error('service error'));

    await getMovesByPokemon(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
