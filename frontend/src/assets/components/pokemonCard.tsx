import type { Pokemon, Type } from "../interfaces/pokemon";

const PokemonCard = ({
  pokemon,
  onClick
}: {
  pokemon: Pokemon;
  onClick: () => void;
}) => {
  return (
    <div
      className="rounded-xl shadow p-4 cursor-pointer"
      onClick={onClick}
    >
      <img className="h-45 object-cover mx-auto" src={pokemon.sprite} alt={pokemon.name}></img>
      <div className="p-4">
        <p className="text-lg font-semibold text-gray-800 text-center">
        {pokemon.name}
        </p>
        <div className="flex justify-center justify-between">
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
    </div>
  );
};

export default PokemonCard;
