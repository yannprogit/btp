// TeamCard.stories.tsx
import type { Meta, Story } from "@ladle/react";
import { http, HttpResponse } from "msw";
import TeamCard from "./TeamCard";
import type { PokemonInTeam, Move } from "../interfaces/pokemon";

export default {
  title: "Components/TeamCard",
} satisfies Meta;

const mockMoves: Move[] = [
  { name: "Tonnerre", type: { name: "Electrik" }, damage: 90, accuracy: 100, description: "Attaque électrique." },
  { name: "Vive-Attaque", type: { name: "Normal" }, damage: 40, accuracy: 100, description: "Attaque rapide." },
  { name: "Cage-Éclair", type: { name: "Electrik" }, damage: 0, accuracy: 100, description: "Paralyse l'ennemi." },
  { name: "Lance-Flammes", type: { name: "Feu" }, damage: 90, accuracy: 100, description: "Crache des flammes." },
];

const mockPikachu: PokemonInTeam = {
  id: 25,
  teamId: "team-001",
  name: "Pikachu",
  sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  types: [{ name: "Electrik" }],
  moves: [
    { name: "Tonnerre", type: { name: "Electrik" }, damage: 90, accuracy: 100, description: "Attaque électrique." },
    { name: "Vive-Attaque", type: { name: "Normal" }, damage: 40, accuracy: 100, description: "Attaque rapide." },
  ],
};

const mockDracaufeu: PokemonInTeam = {
  id: 6,
  teamId: "team-002",
  name: "Dracaufeu",
  sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
  types: [{ name: "Feu" }, { name: "Vol" }],
  moves: [],
};

const defaultHandlers = (id: number) => [
  http.get(`http://localhost:5000/pokeapi/moves/${id}`, () =>
    HttpResponse.json(mockMoves)
  ),
];

// Carte avec attaques déjà sélectionnées
export const AvecAttaques: Story = () => (
  <div className="max-w-sm">
    <TeamCard
      pokemon={mockPikachu}
      onRemove={() => console.log("Supprimé")}
      onChange={(data) => console.log("Modifié :", data)}
    />
  </div>
);
AvecAttaques.parameters = {
  msw: { handlers: defaultHandlers(25) },
};

// Carte sans attaques sélectionnées
export const SansAttaques: Story = () => (
  <div className="max-w-sm">
    <TeamCard
      pokemon={mockDracaufeu}
      onRemove={() => console.log("Supprimé")}
      onChange={(data) => console.log("Modifié :", data)}
    />
  </div>
);
SansAttaques.parameters = {
  msw: { handlers: defaultHandlers(6) },
};

// Pokémon avec deux types
export const DeuxTypes: Story = () => (
  <div className="max-w-sm">
    <TeamCard
      pokemon={mockDracaufeu}
      onRemove={() => console.log("Supprimé")}
      onChange={(data) => console.log("Modifié :", data)}
    />
  </div>
);
DeuxTypes.parameters = {
  msw: { handlers: defaultHandlers(6) },
};

// Erreur de chargement des attaques
export const ErreurChargement: Story = () => (
  <div className="max-w-sm">
    <TeamCard
      pokemon={mockPikachu}
      onRemove={() => console.log("Supprimé")}
      onChange={(data) => console.log("Modifié :", data)}
    />
  </div>
);
ErreurChargement.parameters = {
  msw: {
    handlers: [
      http.get("http://localhost:5000/pokeapi/moves/25", () =>
        HttpResponse.json({ message: "Erreur serveur" }, { status: 500 })
      ),
    ],
  },
};