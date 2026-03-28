import request from 'supertest';
import app from '../../src/app';
import * as moveService from '../../src/services/move';

jest.mock('p-limit', () => {
  return () => (fn: any) => fn();
});
jest.mock('../../src/services/move');

describe('Move E2E', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /moves/:id should return a list of moves', async () => {
    const mockData = [
      {
        id: '1',
        name: 'pound',
        damage: 40,
        accuracy: 100,
        description: 'Inflicts regular damage.',
        type: { name: 'normal' }
      }
    ];

    (moveService.getMovesByPokemon as jest.Mock).mockResolvedValue(mockData);

    const response = await request(app).get('/moves/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  it('GET /moves/:id should return 500 when service throws', async () => {
    (moveService.getMovesByPokemon as jest.Mock).mockRejectedValue(new Error('failure'));

    const response = await request(app).get('/moves/1');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal server error' });
  });
});
