import { useState } from "react";
import axios from "axios";

const userId = 2; // à remplacer par l'ID réel (via context/token/localStorage idéalement)

const UserPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPasswordInfo, setCurrentPasswordInfo] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPasswordPwd, setCurrentPasswordPwd] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); 
  const storedName = localStorage.getItem("userName");
  let userName: string;
  if (storedName !== null) {
   userName = storedName;
  }
  const storedToken = localStorage.getItem("token");

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!currentPasswordInfo) {
      setError("Veuillez entrer votre mot de passe actuel.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/users/${userId}`, {
        name: name || undefined,
        email: email || undefined,
        currentPassword: currentPasswordInfo,
      },
      {
        headers: {
            Authorization: `Bearer ${storedToken}`,
        },
      });
      setMessage("Informations mises à jour !");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour.");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!currentPasswordPwd || !newPassword) {
      setError("Remplissez les deux champs de mot de passe.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/users/${userId}`, {
        currentPassword: currentPasswordPwd,
        newPassword: newPassword,
      },
      {
        headers: {
            Authorization: `Bearer ${storedToken}`,
        },
      });
      setMessage("Mot de passe mis à jour !");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors du changement de mot de passe.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <p className="w-15 h-15 rounded-md bg-blue-100 text-blue-800 font-bold flex items-center justify-center shadow absolute">
        {userName.charAt(0).toUpperCase()}
      </p>  
      <h2 className="text-2xl font-bold mb-10 text-center">Mon Profil</h2>

      {message && <div className="text-green-600 mb-4 text-center">{message}</div>}
      {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

      {/* Formulaire infos */}
      <form onSubmit={handleUpdateInfo} className="space-y-4 mb-8">
        <h3 className="text-xl font-semibold mb-2">Modifier mes informations</h3>

        <input
          type="text"
          placeholder="Nouveau pseudo"
          className="w-full rounded-md py-2 px-3 ring-1 ring-gray-300"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Nouvel email"
          className="w-full rounded-md py-2 px-3 ring-1 ring-gray-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe actuel"
          className="w-full rounded-md py-2 px-3 ring-1 ring-gray-300"
          value={currentPasswordInfo}
          onChange={(e) => setCurrentPasswordInfo(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
        >
          Sauvegarder
        </button>
      </form>

      {/* Formulaire mot de passe */}
      <form onSubmit={handleUpdatePassword} className="space-y-4">
        <h3 className="text-xl font-semibold mb-2">Modifier mon mot de passe</h3>

        <input
          type="password"
          placeholder="Mot de passe actuel"
          className="w-full rounded-md py-2 px-3 ring-1 ring-gray-300"
          value={currentPasswordPwd}
          onChange={(e) => setCurrentPasswordPwd(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Nouveau mot de passe"
          className="w-full rounded-md py-2 px-3 ring-1 ring-gray-300"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
        >
          Changer le mot de passe
        </button>
      </form>
    </div>
  );
};

export default UserPage;
