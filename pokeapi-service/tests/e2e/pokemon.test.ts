import request from 'supertest';
import app from '../../src/app';
import * as pokemonService from '../../src/services/pokemon';

jest.mock('p-limit', () => {
    return () => (fn: any) => fn();
});
jest.mock('../../src/services/pokemon');

describe('PokeAPI Service E2E', () => {

    it('GET /pokemons should return a list of pokemons', async () => {
        const mockData = {
            maxPage: 10,
            pokemons: [
                { id: '1', name: 'bulbasaur', types: [{ name: 'grass' }], sprite: 'url' }
            ]
        };

        (pokemonService.getPokemons as jest.Mock).mockResolvedValue(mockData);

        const response = await request(app).get('/pokemons?page=1');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
    });
});