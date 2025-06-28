import type { Pokemon } from "../data";
import type { PokemonType } from "../data";

const PokemonCard = ({
  pokemon,
  onClick
}: {
  pokemon: Pokemon;
  onClick: () => void;
}) => {
  return (
    <div
      className="pokemon-card rounded-xl shadow p-4 cursor-pointer"
      onClick={onClick}
    >
        <img className="h-45 object-cover mx-auto" src={pokemon.image} alt={pokemon.name}></img>
      <div className="p-4">
        <p className="text-lg font-semibold text-gray-800 text-center">
        {pokemon.name}
        </p>
        <div className="flex justify-center justify-between">
        {pokemon.types.map((type:PokemonType) => (
        <img
          key={type.name}
          src={type.icon}
          alt={type.name}
          title={type.name}
          className="w-10 mx-1"
        />
        ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;