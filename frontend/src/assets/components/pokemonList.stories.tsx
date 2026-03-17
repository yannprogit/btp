// PokemonList.stories.tsx
import type { Meta, Story } from "@ladle/react";
import { http, HttpResponse } from "msw";
import PokemonList from "./pokemonList";
import type { Pokemon } from "../interfaces/pokemon";

initialize();

export default {
  title: "Components/PokemonList",
} satisfies Meta;

const mockPokemons: Pokemon[] = [
  { name: "Bulbizarre", types: [{ name: "Plante" }, { name: "Poison" }], sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" },
  { name: "Salamèche", types: [{ name: "Feu" }], sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png" },
  { name: "Carapuce", types: [{ name: "Eau" }], sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png" },
  { name: "Pikachu", types: [{ name: "Électrik" }], sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" },
];

// Cas nominal
export const Default: Story = () => (
  <PokemonList onSelect={(pkmn) => console.log("Sélectionné :", pkmn.name)} />
);
Default.parameters = {
  msw: {
    handlers: [
      http.get("http://localhost:5000/pokeapi/pokemons", () =>
        HttpResponse.json({ pokemons: mockPokemons, maxPage: 65 })
      ),
    ],
  },
};

// Première page (bouton Précédent désactivé)
export const PremierePage: Story = () => (
  <PokemonList onSelect={(pkmn) => console.log("Sélectionné :", pkmn.name)} />
);
PremierePage.parameters = Default.parameters;

// Dernière page (bouton Suivant désactivé)
export const DernierePage: Story = () => (
  <PokemonList onSelect={(pkmn) => console.log("Sélectionné :", pkmn.name)} />
);
DernierePage.parameters = {
  msw: {
    handlers: [
      http.get("http://localhost:5000/pokeapi/pokemons", () =>
        HttpResponse.json({ pokemons: mockPokemons, maxPage: 65 })
      ),
    ],
  },
};

// Cas d'erreur API
export const Erreur: Story = () => (
  <PokemonList onSelect={(pkmn) => console.log("Sélectionné :", pkmn.name)} />
);
Erreur.parameters = {
  msw: {
    handlers: [
      http.get("http://localhost:5000/pokeapi/pokemons", () =>
        HttpResponse.json(
          { message: "Impossible de récupérer les pokémons" },
          { status: 500 }
        )
      ),
    ],
  },
};

// Liste vide
export const ListeVide: Story = () => (
  <PokemonList onSelect={(pkmn) => console.log("Sélectionné :", pkmn.name)} />
);
ListeVide.parameters = {
  msw: {
    handlers: [
      http.get("http://localhost:5000/pokeapi/pokemons", () =>
        HttpResponse.json({ pokemons: [], maxPage: 0 })
      ),
    ],
  },
};