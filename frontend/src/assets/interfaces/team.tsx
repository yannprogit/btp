import type { PokemonInTeam } from "./pokemon";

export type Team = {
  name:string;
  pokemons:PokemonInTeam[]
}

export type ExistingTeam = Team & {
  id: string;
};