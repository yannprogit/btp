import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import btpLogo from "/assets/images/logo_btp.png";

function Header() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("userName");
    setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.location.href = "/auth";
  };

  const handleGoToSettings = () => {
    navigate("/profile");
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white px-4 sm:px-6 py-3 flex items-center justify-between">
      <a href="/" className="flex items-center gap-3">
        <img
          src={btpLogo}
          alt="Builder Team Pokemon logo"
          className="w-10 sm:w-16"
        />
        <h1 className="hidden sm:block text-2xl font-bold text-gray-800">
          Builder Team Pokemon
        </h1>
      </a>
      <nav>
        {userName ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-md bg-blue-100 text-blue-800 font-bold flex items-center justify-center shadow"
              title={userName}
            >
              {userName.charAt(0).toUpperCase()}
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <div className="px-4 py-2 text-sm text-gray-700 font-semibold border-b border-gray-200">
                  {userName}
                </div>
                <button
                  onClick={handleGoToSettings}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Paramètres
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        ) : (
          <a href="/auth" className="text-blue-600 font-medium hover:underline whitespace-nowrap">
            Login
          </a>
        )}
      </nav>
    </header>
  );
}

export default Header;
