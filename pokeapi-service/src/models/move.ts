import { Type } from "./Type";

export interface Move {
  id: string;
  name: string;
  damage: number;
  accuracy: number;
  description: string;
  type: Type;
}