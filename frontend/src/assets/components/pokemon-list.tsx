import PokemonCard from "./pokemon-card";
import { pokemons } from "../data"; 
import type { Pokemon } from "../data";

type PokemonListProps = {
 onSelect: (pkmn: Pokemon) => void;
}

const PokemonList = ({ onSelect }: PokemonListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.name} pokemon={pokemon} onClick={() => onSelect(pokemon)} />
      ))}
    </div>
  );
};

export default PokemonList;
