import type { PokemonInTeam, PokemonType } from "../data";
import AttackSelect from "./attack-select";
import type { Attack } from "../data";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

type TeamBuilderProps = {
  pokemon: PokemonInTeam;
  onRemove: () => void;
};


const TeamBuilder = ({ pokemon, onRemove }: TeamBuilderProps) => {
  
  const [name, setName] = useState(pokemon.name);
  const [attacks, setAttacks] = useState(["", "", "", ""]);
  const [pokemonAttacks, setPokemonAttacks] = useState<Attack[]>([]);
  const [loadingAttacks, setLoadingAttacks] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  const handleAttackChange = (attackName: string, slot: number) => {
    const updated = [...attacks];
    updated[slot - 1] = attackName;
    setAttacks(updated);
  };

  useEffect(() => {
  const fetchAttacks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/pokeapi/moves/${pokemon.id}`);
      const sortedAttacks = response.data.sort((a: Attack, b: Attack) =>
        a.name.localeCompare(b.name)
      );
      setPokemonAttacks(sortedAttacks);
    } catch (err) {
      setError("Erreur lors du chargement des attaques.");
    } finally {
      setLoadingAttacks(false);
    }
  };

  fetchAttacks();
}, [pokemon.id]);

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
          {pokemon.types.map((type:PokemonType) => (
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
            <AttackSelect key={1} numero={1} onSelect={handleAttackChange} attacks={pokemonAttacks}></AttackSelect>
            {/* Attaque 2 */}
            <AttackSelect key={2} numero={2} onSelect={handleAttackChange} attacks={pokemonAttacks}></AttackSelect>
          </div>
          <div className="flex gap-4 my-2">
            {/* Attaque 3 */}
            <AttackSelect key={3} numero={3} onSelect={handleAttackChange} attacks={pokemonAttacks}></AttackSelect>
            {/* Attaque 4 */}
            <AttackSelect key={4} numero={4} onSelect={handleAttackChange} attacks={pokemonAttacks}></AttackSelect>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamBuilder;