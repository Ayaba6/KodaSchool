// src/components/Header.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { supabase } from "../services/supabaseClient";
import logo from "../assets/logo_kodaschool.png";

export default function Header() {
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  // Fermer le menu avatar au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Charger le profil
  useEffect(() => {
    const fetchProfile = async () => {
      const user = supabase.auth.user();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="KodaSchool" className="h-10 w-auto" />
        </Link>

        {/* Menu desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="font-medium hover:text-indigo-600">Accueil</Link>
          <Link to="/courses" className="font-medium hover:text-indigo-600">Cours</Link>
          <Link to="/about" className="font-medium hover:text-indigo-600">À propos</Link>
        </div>

        {/* Zone utilisateur */}
        <div className="flex items-center gap-3 relative" ref={menuRef}>
          {profile ? (
            <>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold uppercase"
              >
                {profile?.full_name?.[0] || profile?.email?.[0]}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-lg">
                  <p className="px-4 py-2 font-semibold text-slate-700">
                    {profile.full_name || profile.email}
                  </p>
                  <hr />
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-indigo-50"
                  >
                    Mon profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Déconnexion
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              to="/login/student"
              className="font-semibold text-indigo-600"
            >
              Se connecter
            </Link>
          )}

          {/* Bouton mobile */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenu && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="flex flex-col p-4 gap-4">
            <Link to="/" onClick={() => setMobileMenu(false)}>Accueil</Link>
            <Link to="/courses" onClick={() => setMobileMenu(false)}>Cours</Link>
            <Link to="/about" onClick={() => setMobileMenu(false)}>À propos</Link>

            {profile && (
              <>
                <hr />
                <Link to="/profile" onClick={() => setMobileMenu(false)}>
                  Mon profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600"
                >
                  <LogOut size={16} /> Déconnexion
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
