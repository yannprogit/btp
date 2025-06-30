import { PokemonType } from "./pokemonType";

export interface Pokemon {
  id: string;
  name: string;
  types: PokemonType[];
  sprite: string;
}