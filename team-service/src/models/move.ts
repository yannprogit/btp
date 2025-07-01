import { Type } from "./type";

export interface Move {
  id: string|null;
  name: string;
  description: string;
  damage: number;
  accuracy: number;
  type: Type;
}