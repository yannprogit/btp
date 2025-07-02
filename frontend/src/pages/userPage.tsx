import { useState } from "react";
import ConfirmModal from "../assets/components/confirmModal";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import axios from "axios";

const UserPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentPasswordInfo, setCurrentPasswordInfo] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPasswordPwd, setCurrentPasswordPwd] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); 
  const storedToken = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const storedName = localStorage.getItem("userName");
  let userName: string = "";
  if (storedName !== null) {
    userName = storedName;
  }

  const navigate = useNavigate();

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
      localStorage.setItem("userName", name);
      navigate("/profile");
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
      navigate("/profile");
      setMessage("Mot de passe mis à jour !");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors du changement de mot de passe.");
    }
  };

  const handleDeleteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la suppression du compte.");
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  const handleGoToHome = () => {
    navigate("/");
  };

  return (
    <div className="w-full p-6">
      <div>
        <div className="absolute">
          <p className="w-15 h-15 rounded-md bg-blue-100 text-blue-800 font-bold flex items-center justify-center shadow">
            {userName.charAt(0).toUpperCase()}
          </p>
          <p className="text-center">
            {userName}
          </p>
        </div>
        <h2 className="text-2xl font-bold mb-14 text-center">Mon Profil</h2>
        {message && <div className="text-green-600 mb-8 text-center">{message}</div>}
        {error && <div className="text-red-600 mb-8 text-center">{error}</div>}
      </div>
      <div className="md:flex pt-6">
        <div className="md:mx-6 md:w-1/2">
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
        </div>
        <div className="md:mx-6 md:w-1/2">
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
      </div>
      <div className="w-full flex justify-between my-6">
        <button className="w-fit bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={handleGoToHome}>
          Retour
        </button>
        <button className="w-fit flex bg-red-500 text-white py-2 rounded hover:bg-red-600" onClick={handleDeleteUser}>
          <Trash2 className="w-5 h-5 mr-2" /> Supprimer le compte
        </button>
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
    </div>
  );
};

export default UserPage;
