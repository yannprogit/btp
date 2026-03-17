// Header.stories.tsx
import type { Meta, Story } from "@ladle/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./header";

export default {
  title: "Components/Header",
} satisfies Meta;

// Wrapper pour fournir le router
const withRouter = (component: React.ReactNode) => (
  <MemoryRouter>{component}</MemoryRouter>
);

// Utilisateur non connecté
export const NonConnecte: Story = () => {
  localStorage.removeItem("userName");
  return withRouter(<Header />);
};

// Utilisateur connecté
export const Connecte: Story = () => {
  localStorage.setItem("userName", "Alice");
  return withRouter(<Header />);
};

// Nom long pour tester l'affichage
export const NomLong: Story = () => {
  localStorage.setItem("userName", "Jean-Baptiste Dupont");
  return withRouter(<Header />);
};