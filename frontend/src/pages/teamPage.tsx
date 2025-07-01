import { useState, useEffect } from "react";
import PokemonList from "../assets/components/pokemon-list";
import Header from "../assets/components/header";
import TeamBuilder from "../assets/components/team-builder";
import type { Pokemon, PokemonInTeam } from "../assets/data";
import { v4 as uuidv4 } from "uuid";

const TeamPage = () => {
  const [team, setTeam] = useState<PokemonInTeam[]>([]);
  const [teamName, setTeamName] = useState("");
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    setUserName(storedUserName);
  }, []);

  const handleAddToTeam = (pokemon: Pokemon) => {
    if (team.length >= 6) return;
    const pokemonWithTeamId: PokemonInTeam = { ...pokemon, teamId: uuidv4() };
    setTeam([...team, pokemonWithTeamId]);
  };

  const handleRemoveFromTeam = (teamId: string) => {
    setTeam(team.filter((p) => p.teamId !== teamId));
  };

  const handleSaveTeam = () => {
    if (!teamName.trim()) {
      alert("Le nom de l'équipe est requis pour enregistrer.");
      return;
    }

    const teamData = {
      teamName,
      pokemons: team.map(({ teamId, ...rest }) => rest), // retire teamId
      savedBy: userName,
    };

    console.log("Données équipe sauvegardée :", JSON.stringify(teamData, null, 2));
  };

  return (
    <div>
      <Header />
      <div>
        <p className="my-4 mx-8">Notre Team Builder Pokémon est un outil simple et visuel pour créer votre équipe idéale de 6 Pokémon. Sélectionnez vos Pokémon, personnalisez-les, et assurez-vous que votre équipe est bien équilibrée face aux différents types d’adversaires.</p>
        <div className="max-w-full mx-auto px-4 py-4">
          <h2 className="text-xl font-bold mb-2">Mes équipes</h2>
          {team.length > 0 && (
            <div className="mt-6 p-4 bg-neutral-50 rounded-lg text-center">
              <h2 className="text-xl font-bold mb-2">Mon équipe</h2>
              <input
                className="w-1/3 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800 mt-2 mb-4"
                type="text"
                id="teamName"
                name="teamName"
                placeholder="Nom de votre équipe"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              {!userName && (
                <p className="text-red-600 mb-4">Vous devez être connecté pour enregistrer votre équipe.</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {team.map((pokemon) => (
                  <TeamBuilder
                    key={pokemon.teamId}
                    pokemon={pokemon}
                    onRemove={() => handleRemoveFromTeam(pokemon.teamId)}
                  />
                ))}
              </div>
              <button
                disabled={!userName}
                onClick={handleSaveTeam}
                className={`mt-4 px-6 py-2 rounded text-white font-semibold ${
                  userName
                    ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Sauvegarder
              </button>
            </div>
          )}

          {team.length >= 6 && (
            <p className="text-red-600 text-center mt-2">
              Équipe complète ! Vous ne pouvez pas ajouter plus de 6 Pokémon.
            </p>
          )}

          <h2 className="text-3xl font-semibold text-gray-800 mb-8 mt-10 text-center">
            Pokémons
          </h2>

          <PokemonList onSelect={handleAddToTeam} />
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
