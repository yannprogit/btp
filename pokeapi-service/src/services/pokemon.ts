import axios from 'axios';
import { Pokemon } from '../models/pokemon';

export const getPokemons = async (offset: number): Promise<Pokemon[]> => {
  const pkmnList = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
  const results = pkmnList.data.results;

  const detailedData = await Promise.all(
    results.map((pkmn: any) =>
      axios.get(pkmn.url).then(res => res.data)
    )
  );

  const formattedPokemons: Pokemon[] = detailedData.map((data): Pokemon => {
    const types = data.types.map((type: any) => ({
      name: type.type.name
    }));

    return {
      id: String(data.id),
      name: data.name,
      types: types,
      sprite: data.sprites.front_default,
    };
  });

  return formattedPokemons;
};
