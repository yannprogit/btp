export type PokemonType = {
  name: string;
  icon: string;
};

export type Pokemon = {
  name: string;
  image: string;
  types: PokemonType[];
};

export const pokemons: Pokemon[] = [
  {
    name: "Pikachu",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    types: [
      {
        name: "Electric",
        icon: "https://www.serebii.net/pokedex-bw/type/electric.gif"
      }
    ]
  },
  {
    name: "Bulbasaur",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    types: [
      {
        name: "Grass",
        icon: "https://www.serebii.net/pokedex-bw/type/grass.gif"
      },
      {
        name: "Poison",
        icon: "https://www.serebii.net/pokedex-bw/type/poison.gif"
      }
    ]
  },
  {
    name: "Charmander",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    types: [
      {
        name: "Fire",
        icon: "https://www.serebii.net/pokedex-bw/type/fire.gif"
      }
    ]
  },
  {
    name: "Squirtle",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    types: [
      {
        name: "Water",
        icon: "https://www.serebii.net/pokedex-bw/type/water.gif"
      }
    ]
  },
  {
    name: "Jigglypuff",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png",
    types: [
      {
        name: "Normal",
        icon: "https://www.serebii.net/pokedex-bw/type/normal.gif"
      },
      {
        name: "Fairy",
        icon: "https://www.serebii.net/pokedex-bw/type/fairy.gif"
      }
    ]
  },
  {
    name: "Meowth",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png",
    types: [
      {
        name: "Normal",
        icon: "https://www.serebii.net/pokedex-bw/type/normal.gif"
      }
    ]
  },
  {
    name: "Psyduck",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png",
    types: [
      {
        name: "Water",
        icon: "https://www.serebii.net/pokedex-bw/type/water.gif"
      }
    ]
  },
  {
    name: "Snorlax",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png",
    types: [
      {
        name: "Normal",
        icon: "https://www.serebii.net/pokedex-bw/type/normal.gif"
      }
    ]
  }
];
