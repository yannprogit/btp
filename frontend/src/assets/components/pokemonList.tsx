import PokemonCard from "./pokemonCard";
import type { Pokemon } from "../interfaces/pokemon";
import { useState, useEffect } from "react";
import axios from "axios";

type PokemonListProps = {
  onSelect: (pkmn: Pokemon) => void;
};

const PokemonList = ({ onSelect }: PokemonListProps) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [maxPage, setMaxPage] = useState<number>(0);
  const maxOffset = 1300;
  const page = Math.floor(offset / 20);

  useEffect(() => {
    const fetchPokemons = async () => {
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:5000/pokeapi/pokemons?offset=${offset}`
        );
        setPokemons(response.data.pokemons);
        setMaxPage(response.data.maxPage);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Erreur de requête axios lors de la récupération des pokémons");
        } else {
          setError("Erreur inconnue lors de la récupération des pokémons");
        }
      }
    };

    fetchPokemons();
  }, [offset]);

  const handlePrev = () => {
    if (offset > 0) setOffset(offset - 20);
  };

  const handleNext = () => {
    if (offset < maxOffset) setOffset(offset + 20);
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = parseInt(e.target.value, 10);
    if (!isNaN(newPage) && newPage > 0 && newPage <= maxPage) {
      setOffset((newPage - 1) * 20);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="text-red-600 mb-4 text-center">{error}</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {pokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.name}
            pokemon={pokemon}
            onClick={() => onSelect(pokemon)}
          />
        ))}
      </div>
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrev}
          disabled={offset === 0}
          className={`px-4 py-2 rounded font-semibold ${
            offset === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Précédent
        </button>
        <div className="flex items-center gap-2">
          <span>Page</span>
          <input
            type="number"
            value={page + 1}
            min={0}
            max={maxPage}
            onChange={handlePageChange}
            className="w-16 text-center py-1 px-2 rounded-md ring-1 ring-inset ring-gray-300"
          />
          <span> / {maxPage}</span>
        </div>
        <button
          onClick={handleNext}
          disabled={offset >= maxOffset}
          className={`px-4 py-2 rounded font-semibold ${
            offset >= maxOffset
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default PokemonList;
