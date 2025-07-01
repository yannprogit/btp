import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const url = isLogin
      ? "http://localhost:5000/users/auth/login"
      : "http://localhost:5000/users/auth/signup";

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      const response = await axios.post(url, payload);

      const token = response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("userName", response.data.user.name);

      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la requête");
    }
  };

  const handleGoToHome = () => {
    navigate("/");
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-4">
          {isLogin ? "Connexion" : "Inscription"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block font-semibold">Nom</label>
              <input
                name="name"
                type="text"
                onChange={handleChange}
                value={formData.name}
                className="w-full bg-neutral-100 px-3 py-2 rounded"
                required
              />
            </div>
          )}
          <div>
            <label className="block font-semibold">Email</label>
            <input
              name="email"
              type="email"
              onChange={handleChange}
              value={formData.email}
              className="w-full bg-neutral-100 px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Mot de passe</label>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              value={formData.password}
              className="w-full bg-neutral-100 px-3 py-2 rounded"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-6"
          >
            {isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          {isLogin ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? "Créer un compte" : "Se connecter"}
          </button>
        </p>
      </div>
      <div className="flex justify-center mt-6">
        <button className="w-fit bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={handleGoToHome}>
          Retour
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
