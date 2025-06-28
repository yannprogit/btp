import "./App.css";
import { useState } from "react";
import  PokemonList from "./assets/components/pokemon-list";
import Header from "./assets/components/header";
import TeamBuilder from "./assets/components/team-builder";
import type { Pokemon } from "./assets/data";

const App = () => {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  return (
    <div>
      <Header></Header>
      <div>
          <p className="my-4 mx-8">Notre Team Builder Pokémon est un outil simple et visuel pour créer votre équipe idéale de 6 Pokémon. Sélectionnez vos Pokémon, personnalisés les  , et assurez-vous que votre équipe est bien équilibrée face aux différents types d’adversaires.</p>
        {/* <div>
          //team container
        </div> */}
        <div className="max-w-7xl mx-auto px-4 py-10">
          {selectedPokemon && <TeamBuilder pokemon={selectedPokemon} />}
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Pokémons</h2>
          <PokemonList onSelect={setSelectedPokemon} />
        </div>
      </div>
    </div>
  );
};

export default App;
