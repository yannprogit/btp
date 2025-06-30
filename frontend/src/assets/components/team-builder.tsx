import type { PokemonInTeam, PokemonType } from "../data";
import AttackSelect from "./attack-select";
import { useState } from "react";

type TeamBuilderProps = {
  pokemon: PokemonInTeam;
  onRemove: () => void;
};


const TeamBuilder = ({ pokemon, onRemove }: TeamBuilderProps) => {
  
  const [name, setName] = useState(pokemon.name);
  const [attacks, setAttacks] = useState(["", "", "", ""]);

  const handleAttackChange = (attackName: string, slot: number) => {
    const updated = [...attacks];
    updated[slot - 1] = attackName;
    setAttacks(updated);
  };


  return (
    <div className="rounded-xl shadow p-4 bg-white items-center gap-4 justify-center">
      <div className="flex justify-end">
        <button className="btn btn-sm btn-circle btn-ghost absolute"
        onClick={onRemove}
      >✕</button>
      </div>
      <img src={pokemon.sprite} alt={pokemon.name} className="m-auto w-40" />
      <div>
        <div className="flex">
          <div className="w-1/2 my-2">
            <label className="flex w-full font-bold" htmlFor="pokemonName">Nom</label>
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
            <AttackSelect key={1} numero={1} onSelect={handleAttackChange}></AttackSelect>
            {/* Attaque 2 */}
            <AttackSelect key={2} numero={2} onSelect={handleAttackChange}></AttackSelect>
          </div>
          <div className="flex gap-4 my-2">
            {/* Attaque 3 */}
            <AttackSelect key={3} numero={3} onSelect={handleAttackChange}></AttackSelect>
            {/* Attaque 4 */}
            <AttackSelect key={4} numero={4} onSelect={handleAttackChange}></AttackSelect>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamBuilder;