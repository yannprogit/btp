import { Type } from "./Type";

export interface Pokemon {
  id: string;
  name: string;
  types: Type[];
  sprite: string;
}