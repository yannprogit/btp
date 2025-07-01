export type PokemonType = {
  name: string;
};

export type Pokemon = {
  id: string
  name: string;
  sprite: string;
  types: PokemonType[];
};

export type Attack = {
  id:string;
  name:string;
  type:string;
  damage:number;
  accuracy:number;
  description:string;
  category:string;
}

export type PokemonInTeam = Pokemon & {
  teamId: string;
};

export const pokemons: Pokemon[] = [
  {
    id:"21",
    name: "Pikachu",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    types: [
      {
        name: "electric",
      }
    ]
  },
  {
    id:"22",
    name: "Bulbasaur",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    types: [
      {
        name: "grass",
      },
      {
        name: "poison",
      }
    ]
  },
  {
    id:"25",
    name: "Charmander",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    types: [
      {
        name: "fire",
      }
    ]
  },
  {
    id:"26",
    name: "Squirtle",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    types: [
      {
        name: "water",
      }
    ]
  },
  {
    id:"28",
    name: "Jigglypuff",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png",
    types: [
      {
        name: "normal",
      },
      {
        name: "fairy",
      }
    ]
  },
  {
    id:"36",
    name: "Meowth",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png",
    types: [
      {
        name: "normal",
      }
    ]
  },
  {
    id:"78",
    name: "Psyduck",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png",
    types: [
      {
        name: "water",
      }
    ]
  },
  {
    id:"48",
    name: "Snorlax",
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png",
    types: [
      {
        name: "normal",
      }
    ]
  }
];

export const attacks:Attack[] = [
  {
    name: "Flammeche",
    type: {
        name: "fire",
      },
    damage: 40,
    accuracy: 100
  },
  {
    name: "Tonnerre",
    type: {
        name: "electric",
      },
    damage: 90,
    accuracy: 100
  },
  {
    name: "Lance-Flammes",
    type: {
        name: "fire",
      },
    damage: 90,
    accuracy: 100
  },
  {
    name: "Dracogriffe",
    type: {
        name: "water",
      },
    damage: 80,
    accuracy: 100
  }
];