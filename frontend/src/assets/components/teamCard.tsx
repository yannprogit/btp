import type { PokemonInTeam, Move, Type } from "../interfaces/pokemon";
import MoveSelect from "./moveSelect";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

type TeamCardProps = {
  pokemon: PokemonInTeam;
  onRemove: () => void;
  onChange: (data: { teamId: string; name: string; moves: Move[] }) => void;
};

const TeamCard = ({ pokemon, onRemove, onChange }: TeamCardProps) => {
  const [name, setName] = useState(pokemon.name);
  const [moves, setMoves] = useState<string[]>(pokemon.moves?.map((m) => m.name) ?? ["", "", "", ""]);
  const [pokemonMoves, setPokemonMoves] = useState<Move[]>([]);
  useEffect(() => {
    setName(pokemon.name);
    setMoves(pokemon.moves?.map((m) => m.name) ?? ["", "", "", ""]);
  }, [pokemon]);

  useEffect(() => {
    const fetchMoves = async () => {
      try {
        const moveSourceId = (pokemon as any).speciesId ?? pokemon.id;
        const response = await axios.get(`http://localhost:5000/pokeapi/moves/${moveSourceId}`);
        const sortedMoves = response.data.sort((a: Move, b: Move) =>
          a.name.localeCompare(b.name)
        );
        setPokemonMoves(sortedMoves);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error(error.response?.data?.message || "Erreur de requête axios lors de la de la récupération des attaques");
        } else {
          console.error("Erreur lors du chargement des attaques.");
        }
      }
    };
    fetchMoves();
  }, [pokemon.id, pokemon]);

  const handleMoveChange = (moveName: string, slot: number) => {
    const updated = [...moves];
    updated[slot - 1] = moveName;
    setMoves(updated);

    const selectedMoveObjects = updated
      .map((name) => pokemonMoves.find((m) => m.name === name))
      .filter((m): m is Move => !!m);

    onChange({ teamId: pokemon.teamId, name, moves: selectedMoveObjects });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);

    const selectedMoveObjects = moves
      .map((name) => pokemonMoves.find((m) => m.name === name))
      .filter((m): m is Move => !!m);

    onChange({ teamId: pokemon.teamId, name: newName, moves: selectedMoveObjects });
  };

  return (
    <div className="rounded-xl shadow p-4 bg-white items-center gap-4 justify-center">
      <div className="flex justify-end">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute hover:text-red-600"
          onClick={onRemove}
          aria-label="Supprimer le Pokémon"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      <img src={pokemon.sprite} alt={pokemon.name} className="m-auto w-40" />
      <div>
        <div className="flex">
          <div className="w-1/2 my-2">
            <label className="flex w-full font-bold mb-1" htmlFor="pokemonName">Nom</label>
            <input
              className="w-full rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400"
              type="text"
              id="pokemonName"
              name="pokemonName"
              value={name}
              onChange={handleNameChange}
            />
          </div>
          <div className="flex justify-center mx-auto items-center justify-between">
            {pokemon.types.map((type: Type) => (
              <img
                key={type.name}
                src={`/assets/images/types/${type.name}.png`}
                alt={type.name}
                title={type.name}
                className="w-12 mx-1"
              />
            ))}
          </div>
        </div>
        <div className="w-full my-2">
          <div className="flex gap-4 my-2">
            <MoveSelect numero={1} onSelect={handleMoveChange} moves={pokemonMoves} selectedMove={moves[0]} />
            <MoveSelect numero={2} onSelect={handleMoveChange} moves={pokemonMoves} selectedMove={moves[1]} />
          </div>
          <div className="flex gap-4 my-2">
            <MoveSelect numero={3} onSelect={handleMoveChange} moves={pokemonMoves} selectedMove={moves[2]} />
            <MoveSelect numero={4} onSelect={handleMoveChange} moves={pokemonMoves} selectedMove={moves[3]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
