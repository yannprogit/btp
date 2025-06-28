import type { Pokemon } from "../data";

const TeamBuilder = ({ pokemon }: { pokemon: Pokemon }) => {
  return (
    <div className="mt-6 p-4 border-t">
      <h3 className="text-xl font-bold mb-2">Personnaliser {pokemon.name}</h3>
      <div className="flex items-center gap-4">
        <img src={pokemon.image} alt={pokemon.name} className="w-24 h-24" />
        <div>
          <p><strong>Nom :</strong> {pokemon.name}</p>
          <p><strong>Types :</strong> {pokemon.types.map((t) => t.name).join(", ")}</p>
          {/* Tu peux ici ajouter un input pour donner un surnom, choisir une attaque, etc. */}
        </div>
      </div>
    </div>
  );
};

export default TeamBuilder;