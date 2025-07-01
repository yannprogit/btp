import { Move } from "./move";
import { Type } from "./type";

export interface Pokemon {
  id: string|null;
  name: string;
  sprite: string;
  speciesId: string;
  types: Type[];
  moves: Move[];
}