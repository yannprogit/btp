import { Pokemon } from '../../../src/models/pokemon';

describe('Pokemon Model', () => {
    it('should be structured correctly', () => {
        const pokemon: Pokemon = {
            id: '1',
            name: 'bulbasaur',
            types: [{ name: 'grass' }, { name: 'poison' }],
            sprite: 'https://example.com/sprite.png'
        };

        expect(pokemon).toBeDefined();
        expect(pokemon.id).toBe('1');
        expect(pokemon.types).toHaveLength(2);
    });
});