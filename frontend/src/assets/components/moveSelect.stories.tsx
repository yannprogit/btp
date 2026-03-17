// MoveSelect.stories.tsx
import type { Meta, Story } from "@ladle/react";
import MoveSelect from "./moveSelect";
import type { Move } from "../interfaces/pokemon";

export default {
  title: "Components/MoveSelect",
} satisfies Meta;

// Mock de moves pour les stories
const mockMoves: Move[] = [
  {
    name: "Tonnerre",
    type: { name: "Électrik" },
    damage: 90,
    accuracy: 100,
    description: "Attaque électrique puissante.",
  },
  {
    name: "Hydrocanon",
    type: { name: "Eau" },
    damage: 110,
    accuracy: 80,
    description: "Lance un jet d'eau dévastateur.",
  },
  {
    name: "Lance-Flammes",
    type: { name: "Feu" },
    damage: 90,
    accuracy: 100,
    description: "Crache des flammes sur l'adversaire.",
  },
  {
    name: "Tranch'Herbe",
    type: { name: "Plante" },
    damage: 55,
    accuracy: 95,
    description: "Tranche l'ennemi avec des feuilles acérées.",
  },
];

// Slot vide sans sélection
export const SansSelection: Story = () => (
  <MoveSelect
    numero={1}
    moves={mockMoves}
    onSelect={(attackName, slot) => console.log(`Slot ${slot} : ${attackName}`)}
  />
);

// Avec une attaque déjà sélectionnée
export const AvecSelection: Story = () => (
  <MoveSelect
    numero={2}
    moves={mockMoves}
    selectedMove="Tonnerre"
    onSelect={(attackName, slot) => console.log(`Slot ${slot} : ${attackName}`)}
  />
);

// Liste vide (cas d'erreur / chargement)
export const ListeVide: Story = () => (
  <MoveSelect
    numero={1}
    moves={[]}
    onSelect={(attackName, slot) => console.log(`Slot ${slot} : ${attackName}`)}
  />
);

// Affichage des 4 slots comme en conditions réelles
export const QuatreSlots: Story = () => (
  <div className="max-w-sm p-4">
    {[1, 2, 3, 4].map((slot) => (
      <MoveSelect
        key={slot}
        numero={slot}
        moves={mockMoves}
        selectedMove={slot === 1 ? "Tonnerre" : undefined}
        onSelect={(attackName, s) => console.log(`Slot ${s} : ${attackName}`)}
      />
    ))}
  </div>
);