import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen p-5">
      <div className="bg-white rounded-xl px-10 py-15 sm:px-5 sm:py-10 max-w-[500px] w-full text-center shadow-[0_20px_60px_rgba(0,0,0,0.3)]">

        {/* 404 code */}
        <div className="mb-8">
          <h1 className="m-0 text-[120px] sm:text-[80px] font-black leading-none bg-clip-text">
            404
          </h1>
        </div>

        {/* Title */}
        <h2 className="mt-5 mb-4 text-[28px] sm:text-2xl font-bold">
          Page non trouvée
        </h2>

        {/* Description */}
        <p className="mb-8 text-base sm:text-sm leading-relaxed">
          Désolé, la page que vous cherchez n'existe pas ou a été supprimée.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap sm:flex-col gap-3 mb-8 justify-center">
          <button
            className="flex items-center justify-center gap-2 px-6 py-3 border-none rounded-md text-base font-semibold cursor-pointer transition-all duration-200 flex-1 min-w-[150px] sm:min-w-0 sm:w-full text-white bg-blue-600 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(102,126,234,0.4)] active:translate-y-0"
            onClick={() => navigate('/')}
          >
            <Home size={20} />
            Retour à l'accueil
          </button>

          <button
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-md text-base font-semibold cursor-pointer transition-all duration-200 flex-1 min-w-[150px] sm:min-w-0 sm:w-full text-blue-600 bg-transparent border-2 border-blue-600 hover:bg-[#edf2f7] hover:-translate-y-0.5 active:translate-y-0"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
            Retourner
          </button>
        </div>

        {/* Footer */}
        <div className="pt-5 border-t border-[#e2e8f0]">
          <p className="m-0 text-sm text-[#a0aec0]">
            Si vous pensez qu'il s'agit d'une erreur, contactez le support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;