// PokemonCard.stories.tsx
import type { Meta, Story } from "@ladle/react";
import PokemonCard from "./pokemonCard";

export default {
  title: "Components/PokemonCard",
} satisfies Meta;

export const UnType: Story = () => (
  <div className="max-w-xs">
    <PokemonCard
      pokemon={{
        name: "Pikachu",
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        types: [{ name: "Electrik" }],
      }}
      onClick={() => console.log("Cliqué sur Pikachu")}
    />
  </div>
);

export const DeuxTypes: Story = () => (
  <div className="max-w-xs">
    <PokemonCard
      pokemon={{
        name: "Dracaufeu",
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
        types: [{ name: "Feu" }, { name: "Vol" }],
      }}
      onClick={() => console.log("Cliqué sur Dracaufeu")}
    />
  </div>
);

export const Grille: Story = () => (
  <div className="grid grid-cols-3 gap-4 max-w-xl">
    {[
      { name: "Bulbizarre", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png", types: [{ name: "Plante" }, { name: "Poison" }] },
      { name: "Salamèche", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png", types: [{ name: "Feu" }] },
      { name: "Carapuce", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png", types: [{ name: "Eau" }] },
    ].map((pokemon) => (
      <PokemonCard
        key={pokemon.name}
        pokemon={pokemon}
        onClick={() => console.log(`Cliqué sur ${pokemon.name}`)}
      />
    ))}
  </div>
);