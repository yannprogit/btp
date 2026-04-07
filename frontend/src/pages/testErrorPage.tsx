import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../assets/components/header";
import { formatErrorMessage } from "../utils/errorFormatter";
import { useIsDevelopmentMode } from "../hooks/useIsDevelopmentMode";

type DemoResult = {
  title: string;
  status?: number;
  message: string;
  raw?: unknown;
};

const TestErrorPage = () => {
  const navigate = useNavigate();
  const { isDev } = useIsDevelopmentMode();
  const [shouldCrash, setShouldCrash] = useState(false);
  const [result, setResult] = useState<DemoResult | null>(null);

  if (shouldCrash) {
    throw new Error("Crash JS frontend volontaire (demo)");
  }

  const runApiCall = async (title: string, callback: () => Promise<unknown>) => {
    setResult(null);
    try {
      await callback();
      setResult({
        title,
        message: "Requete reussie (pas d'erreur detectee)",
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setResult({
          title,
          status: error.response?.status,
          message: formatErrorMessage(error, isDev),
          raw: error.response?.data,
        });
        return;
      }

      setResult({
        title,
        message: formatErrorMessage(error, isDev),
      });
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-bold">Zone de test des erreurs</h1>
        <p className="text-gray-700">
          Cette page sert a demontrer la gestion des erreurs frontend, backend et HTTP.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            className="rounded-lg p-4 text-left bg-red-50 border border-red-300 hover:bg-red-100"
            onClick={() => setShouldCrash(true)}
          >
            <p className="font-semibold text-red-700">Crash JS frontend</p>
            <p className="text-sm text-red-700">Declenche ErrorBoundary (throw pendant le render)</p>
          </button>

          <button
            className="rounded-lg p-4 text-left bg-orange-50 border border-orange-300 hover:bg-orange-100"
            onClick={() => navigate("/page-inexistante-demo")}
          >
            <p className="font-semibold text-orange-700">Erreur 404 frontend</p>
            <p className="text-sm text-orange-700">Redirige vers la page Not Found</p>
          </button>

          <button
            className="rounded-lg p-4 text-left bg-blue-50 border border-blue-300 hover:bg-blue-100"
            onClick={() =>
              runApiCall("API 404 (route typo)", () => axios.get("http://localhost:5000/pokeapii/pokemons?offset=0"))
            }
          >
            <p className="font-semibold text-blue-700">Erreur API (404)</p>
            <p className="text-sm text-blue-700">Route invalide pour tester le formatter dev/prod</p>
          </button>

          <button
            className="rounded-lg p-4 text-left bg-purple-50 border border-purple-300 hover:bg-purple-100"
            onClick={() => runApiCall("HTTP 401 Unauthorized", () => axios.get("http://localhost:5000/teams"))}
          >
            <p className="font-semibold text-purple-700">Erreur HTTP 401</p>
            <p className="text-sm text-purple-700">Appel d'une route protegee sans token</p>
          </button>

          <button
            className="rounded-lg p-4 text-left bg-emerald-50 border border-emerald-300 hover:bg-emerald-100"
            onClick={() => runApiCall("Backend SQL/ORM error", () => axios.get("http://localhost:5000/teams/debug/sql-error"))}
          >
            <p className="font-semibold text-emerald-700">Erreur SQL backend</p>
            <p className="text-sm text-emerald-700">Force une erreur Postgres pour la demo</p>
          </button>

          <button
            className="rounded-lg p-4 text-left bg-pink-50 border border-pink-300 hover:bg-pink-100"
            onClick={() => runApiCall("Backend crash", () => axios.get("http://localhost:5000/teams/debug/crash"))}
          >
            <p className="font-semibold text-pink-700">Crash code backend</p>
            <p className="text-sm text-pink-700">Lance une exception serveur volontaire</p>
          </button>
        </div>

        {result && (
          <div className="rounded-lg border border-gray-300 bg-white p-4">
            <h2 className="text-xl font-semibold mb-2">Resultat: {result.title}</h2>
            <p className="mb-1">
              <span className="font-semibold">Mode:</span> {isDev ? "DEV" : "PROD"}
            </p>
            {result.status && (
              <p className="mb-1">
                <span className="font-semibold">HTTP status:</span> {result.status}
              </p>
            )}
            <p className="mb-2">
              <span className="font-semibold">Message affiche a l'utilisateur:</span> {result.message}
            </p>
            {isDev && result.raw && (
              <pre className="text-xs bg-gray-100 border border-gray-300 rounded p-3 overflow-auto">
                {JSON.stringify(result.raw, null, 2)}
              </pre>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default TestErrorPage;
