import axios from 'axios';
import { Move } from '../models/move';
import pLimit from 'p-limit';

export const getMovesByPokemon = async (id: string): Promise<Move[]> => {
  const pokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const moves = pokemon.data.moves;

  const limit = pLimit(10);

  const detailedData = await Promise.all(
    moves.map((move: any) =>
      limit(() => axios.get(move.move.url).then(res => res.data))
    )
  );

  const formattedMoves: Move[] = detailedData.map((data): Move => {
    const effectEntry = data.effect_entries.find(
        (entry: any) => entry.language.name === "en"
    );

    return {
      id: String(data.id),
      name: data.name,
      damage: data.power ?? 0,
      accuracy: data.accuracy ?? 100,
      description: effectEntry?.effect ?? "No description available",
      category: data.damage_class.name,
      type: data.type.name,
    };
  });

  return formattedMoves;
};
