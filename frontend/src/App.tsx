import "./App.css";
import { useState } from "react";
import  PokemonList from "./assets/components/pokemon-list";
import Header from "./assets/components/header";
import TeamBuilder from "./assets/components/team-builder";
import type { Pokemon, PokemonInTeam } from "./assets/data";
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [team, setTeam] = useState<PokemonInTeam[]>([]);

  const handleAddToTeam = (pokemon: Pokemon) => {
    if (team.length >= 6) return;
    const pokemonWithTeamId:PokemonInTeam = { ...pokemon, teamId: uuidv4() };
    setTeam([...team, pokemonWithTeamId]);
  };

  const handleRemoveFromTeam = (teamId: string) => {
    setTeam(team.filter((p) => p.teamId !== teamId));
  };
  
  return (
    <div>
      <Header></Header>
      <div>
        <p className="my-4 mx-8">Notre Team Builder Pokémon est un outil simple et visuel pour créer votre équipe idéale de 6 Pokémon. Sélectionnez vos Pokémon, personnalisés les  , et assurez-vous que votre équipe est bien équilibrée face aux différents types d’adversaires.</p>
        <div className="max-w-full mx-auto px-4 py-4">
          {team.length > 0 && (
            <div className="mt-6 p-4 bg-neutral-50 rounded-lg text-center ">
              <h3 className="text-xl font-bold mb-2">Mon équipe</h3>
              <input 
                className="w-1/3 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 mt-2 mb-6" 
                type="text"
                id="teamName"
                name="teamName">
              </input>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {team.map((pokemon) => (
                  <TeamBuilder key={pokemon.teamId} pokemon={pokemon} onRemove={() => handleRemoveFromTeam(pokemon.teamId)}/>
                ))}
              </div>
            </div>
            )}
          {team.length >= 6 && (
          <p className="text-red-600 text-center mt-4">
          Équipe complète ! Vous ne pouvez pas ajouter plus de 6 Pokémon.
          </p>
          )}
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 mt-10 text-center">Pokémons</h2>
            <PokemonList onSelect={handleAddToTeam} />
        </div>
      </div>
    </div>
  );
};

export default App;
