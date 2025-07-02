export type Type = {
  name: string;
};

export type Pokemon = {
  id: string
  name: string;
  sprite: string;
  types: Type[];
};

export type PokemonInTeam = Pokemon & {
  teamId: string;
  moves: Move[];
};

export type Move = {
  id:string;
  name:string;
  type:Type;
  damage:number;
  accuracy:number;
  description:string;
}