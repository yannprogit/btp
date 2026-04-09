import type { Pokemon, Type } from "../interfaces/pokemon";

const typeColors: Record<string, string> = {
  fire: "#f97316",
  water: "#3b82f6",
  grass: "#22c55e",
  electric: "#facc15",
  psychic: "#ec4899",
  ice: "#67e8f9",
  dragon: "#7c3aed",
  dark: "#374151",
  fairy: "#f9a8d4",
  normal: "#a8a29e",
  fighting: "#b91c1c",
  flying: "#60a5fa",
  poison: "#a855f7",
  ground: "#92400e",
  rock: "#78716c",
  bug: "#84cc16",
  ghost: "#6b21a8",
  steel: "#9ca3af",
};

const PokemonCard = ({
  pokemon,
  onClick
}: {
  pokemon: Pokemon;
  onClick: () => void;
}) => {

  const type1 = pokemon.types[0]?.name;
  const type2 = pokemon.types[1]?.name;

  const color1 = typeColors[type1] || "#e5e7eb";
  const color2 = typeColors[type2] || color1;

  const background = type2
    ? `linear-gradient(135deg, ${color1}, ${color2})`
    : color1;

  return (
    <div
      className="rounded-xl shadow p-4 cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:shadow-lg hover:scale-[1.02]"
      onClick={onClick}
      style={{ background }}
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
