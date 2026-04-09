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
      className="rounded-xl shadow p-4 cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:shadow-lg hover:scale-[1.02]"
      onClick={onClick}
    >
      <img className="h-45 object-cover mx-auto transition-transform duration-200 hover:scale-105"src={pokemon.sprite} alt={pokemon.name}/>
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
