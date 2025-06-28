import PokemonCard from "./pokemon-card";
import { pokemons } from "../data"; 
import type { Pokemon } from "../data";

const PokemonList = ({ onSelect }: { onSelect: (p: Pokemon) => void }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {pokemons.map((p) => (
        <PokemonCard key={p.name} pokemon={p} onClick={() => onSelect(p)} />
      ))}
    </div>
  );
};

export default PokemonList;
