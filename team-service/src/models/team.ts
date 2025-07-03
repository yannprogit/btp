import { Pokemon } from "./pokemon";

export interface Team {
  id: string;
  name: string;
  userId: string;
  pokemons: Pokemon[];
}