import { useState, useEffect } from "react";
import PokemonList from "../assets/components/pokemonList";
import Header from "../assets/components/header";
import TeamCard from "../assets/components/teamCard";
import ConfirmModal from "../assets/components/confirmModal";
import type { PokemonInTeam, Pokemon, Move } from "../assets/interfaces/pokemon";
import type { ExistingTeam } from "../assets/interfaces/team";
import { v4 as uuidv4 } from "uuid";
import { Trash2 } from "lucide-react";
import axios from "axios";

type PokemonInTeamExtended = PokemonInTeam & {
  moves?: Move[];
  dataBaseId: string | null;
  speciesId: string;
};

const TeamPage = () => {
  const [team, setTeam] = useState<PokemonInTeamExtended[]>([]);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const [existingTeams, setExistingTeams] = useState<ExistingTeam[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");

  const fetchTeams = async () => {
    try {
      if (!token) return;
      const response = await axios.get("http://localhost:5000/teams", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExistingTeams(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data?.message || "Erreur de requête axios lors de la récupération des équipes");
      } else {
        console.error("Erreur lors du chargement des équipes :", error);
      }
    }
  };

  const handleAddToTeam = (pokemon: Pokemon) => {
    if (team.length >= 6) return;
    const newPokemon: PokemonInTeamExtended = {
      ...pokemon,
      dataBaseId: null,
      speciesId: pokemon.id,
      teamId: uuidv4(),
      moves: [],
      name: pokemon.name,
    };
    setTeam([...team, newPokemon]);
  };

  const handleRemoveFromTeam = (teamId: string) => {
    setTeam(team.filter((p) => p.teamId !== teamId));
  };

  const handleUpdatePokemonData = (data: { teamId: string; name: string; moves: Move[] }) => {
    const updated = team.map((pokemon) =>
      pokemon.teamId === data.teamId
        ? { ...pokemon, name: data.name, moves: data.moves }
        : pokemon
    );
    setTeam(updated);
  };

  const handleSaveTeam = async () => {
    if (!name.trim()) {
      alert("Le nom de l'équipe est requis pour enregistrer.");
      return;
    }

    const teamData = {
      name,
      pokemons: team.map((pokemon) => ({
        id: pokemon.dataBaseId,
        speciesId: pokemon.speciesId,
        name: pokemon.name,
        types: pokemon.types,
        sprite: pokemon.sprite,
        moves: pokemon.moves || [],
      })),
    };

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token non trouvé. Veuillez vous connecter.");
      return;
    }
    try {
      const url = selectedTeamId
        ? `http://localhost:5000/teams/${selectedTeamId}`
        : "http://localhost:5000/teams";
      const method = selectedTeamId ? axios.put : axios.post;
      const response = await method(url, teamData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert(`Équipe ${selectedTeamId ? "modifiée" : "enregistrée"} avec succès !`);
      await fetchTeams();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data?.message || "Erreur de requête axios lors de l'enregistrement de l'équipe");
      } else {
        console.error("Erreur lors de la sauvegarde :", error);
        alert("Erreur lors de la sauvegarde de l'équipe.");
      }
    }
  };

  const handleDeleteTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedTeamId || !token) return;

    try {
      await axios.delete(`http://localhost:5000/teams/${selectedTeamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Équipe supprimée avec succès !");
      setTeam([]);
      setName("");
      setSelectedTeamId(null);

      // Recharger les équipes
      const refreshed = await axios.get("http://localhost:5000/teams", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExistingTeams(refreshed.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data?.message || "Erreur lors de la suppression de l'équipe");
      } else {
        console.error("Erreur inconnue lors de la suppression.");
      }
    } finally {
      setShowModal(false);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    setUserName(storedUserName);
    fetchTeams();
  }, [token,fetchTeams]);

  return (
    <div>
      <Header />
      <div>
        <p className="my-4 mx-8">
          Notre Team Builder Pokémon est un outil simple et visuel pour créer votre équipe idéale de 6 Pokémon. Sélectionnez vos Pokémon, personnalisés les et assurez-vous que votre équipe est bien équilibrée face aux différents types d’adversaires.
        </p>
        <div className="max-w-full mx-auto px-4 py-4">
          {token && (
            <div className="mb-4 flex justify-center">
              <label className="font-bold block mb-1">Charger une équipe :</label>
              <select
                className="w-1/6 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 ml-4"
                onChange={async (e) => {
                  const teamId = e.target.value;
                  setSelectedTeamId(teamId);
                  try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(`http://localhost:5000/teams/${teamId}`, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    const loadedTeam = response.data;
                    setName(loadedTeam.name);
                    setTeam(
                      loadedTeam.pokemons.map((pokemon: any) => ({
                        ...pokemon,
                        dataBaseId: pokemon.id ?? null,
                        speciesId: pokemon.speciesId,
                        teamId: uuidv4(),
                      }))
                    );
                  } catch (error: unknown) {
                    if (axios.isAxiosError(error)) {
                      console.error(
                        error.response?.data?.message ||
                          "Erreur de requête axios lors de la récupération de l'équipe"
                      );
                    } else {
                      console.error("Erreur chargement équipe :", error);
                    }
                  }
                }}
              >
                <option value="">Sélectionner une équipe</option>
                {existingTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {team.length > 0 && (
            <div className="mt-6 p-4 bg-neutral-100 rounded-lg text-center">
              <h2 className="text-xl font-bold mb-2">Mon équipe</h2>
              <input
                className="w-1/3 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 mt-2 mb-4"
                type="text"
                placeholder="Nom de votre équipe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {!userName && (
                <p className="text-red-600 mb-4">Vous devez être connecté pour enregistrer votre équipe.</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {team.map((pokemon) => (
                  <TeamCard
                    key={pokemon.teamId}
                    pokemon={pokemon}
                    onRemove={() => handleRemoveFromTeam(pokemon.teamId)}
                    onChange={handleUpdatePokemonData}
                  />
                ))}
              </div>
              <div className="flex justify-center gap-6">
                <button
                  disabled={!userName}
                  onClick={handleSaveTeam}
                  className={`mt-4 px-6 py-2 rounded text-white font-semibold ${
                    userName ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
                  }`}
                >
                  Sauvegarder
                </button>
                {selectedTeamId && (
                  <button className="flex mt-4 px-6 py-2 rounded text-white font-semibold bg-red-500 hover:bg-red-600" onClick={handleDeleteTeam}>
                    <Trash2 className="w-5 h-5 mr-2" /> Supprimer l'équipe
                  </button>)};
              </div>
            </div>
          )}

          {team.length >= 6 && (
            <p className="text-red-600 text-center mt-2">
              Équipe complète ! Vous ne pouvez pas ajouter plus de 6 Pokémon.
            </p>
          )}

          <h2 className="text-3xl font-semibold text-gray-800 mb-8 mt-10 text-center">Pokémons</h2>
          <PokemonList onSelect={handleAddToTeam} />
        </div>
      </div>
      {showModal && (
          <ConfirmModal
            title="Confirmer la suppression"
            message="Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            confirmText="Supprimer"
            cancelText="Annuler"
          />
        )}
    </div>
  );
};

export default TeamPage;
