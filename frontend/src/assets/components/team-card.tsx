import type { PokemonInTeam, Type } from "../data";
import MoveSelect from "./move-select";
import type { Move } from "../data";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

type TeamCardProps = {
  pokemon: PokemonInTeam;
  onRemove: () => void;
};


const TeamCard = ({ pokemon, onRemove }: TeamCardProps) => {
  const [selectedMoves, setSelectedMoves] = useState([]);
  const [name, setName] = useState(pokemon.name);
  const [moves, setMoves] = useState(["", "", "", ""]);
  const [pokemonMoves, setPokemonMoves] = useState<Move[]>([]);
  const [loadingMoves, setLoadingMoves] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  const handleMoveChange = (moveName: string, slot: number) => {
    const updated = [...moves];
    updated[slot - 1] = moveName;
    setMoves(updated);
  };

  useEffect(() => {
    const fetchMoves = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/pokeapi/moves/${pokemon.id}`);
        const sortedMoves = response.data.sort((a: Move, b: Move) =>
          a.name.localeCompare(b.name)
        );
        setPokemonMoves(sortedMoves);
      } catch (err) {
        setError("Erreur lors du chargement des attaques.");
      } finally {
        setLoadingMoves(false);
      }
    };
    fetchMoves();
  }, [pokemon.id]);

    const handleSelectMove = (move) => {
    const updated = [...selectedMoves];
    if (updated.length < 4) {
      updated.push(move);
      setSelectedMoves(updated);
      updateMoves(index, updated);
    }
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
              className="w-full rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800" 
              type="text"
              id="pokemonName"
              name="pokemonName"
              placeholder={pokemon.name}
              onChange={(e) => setName(e.target.value)}   >
            </input>
          </div>
          <div className="flex justify-center mx-auto items-center justify-between">
          {pokemon.types.map((type:Type) => (
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
            {/* Attaque 1 */}
            <MoveSelect key={1} numero={1} onSelect={handleMoveChange} moves={pokemonMoves}></MoveSelect>
            {/* Attaque 2 */}
            <MoveSelect key={2} numero={2} onSelect={handleMoveChange} moves={pokemonMoves}></MoveSelect>
          </div>
          <div className="flex gap-4 my-2">
            {/* Attaque 3 */}
            <MoveSelect key={3} numero={3} onSelect={handleMoveChange} moves={pokemonMoves}></MoveSelect>
            {/* Attaque 4 */}
            <MoveSelect key={4} numero={4} onSelect={handleMoveChange} moves={pokemonMoves}></MoveSelect>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;