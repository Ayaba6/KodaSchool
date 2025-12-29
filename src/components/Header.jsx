// src/components/Header.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, ChevronDown } from "lucide-react";
import { supabase } from "../services/supabaseClient.js";
import logo from "../assets/logo_kodaschool.png";

export default function Header() {
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  // Fermer le menu si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Récupérer le profil utilisateur
  useEffect(() => {
    const fetchProfile = async () => {
      const user = supabase.auth.user();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) console.error(error);
      else setProfile(data);
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="KodaSchool Logo" className="h-16 w-auto object-contain" />
        </Link>

        {/* Avatar + menu */}
        <div className="relative flex items-center gap-3" ref={menuRef}>
          {profile ? (
            <>
              {/* Avatar circulaire */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold uppercase"
                title={profile.full_name || profile.email}
              >
                {profile?.full_name?.[0] || profile?.email?.[0]}
              </button>

              {/* Icône de déconnexion */}
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 transition"
                title="Déconnexion"
              >
                <LogOut size={20} />
              </button>

              {/* Menu déroulant */}
              {menuOpen && (
                <div className="absolute right-0 mt-12 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                  <p className="px-4 py-2 text-slate-700 font-semibold">
                    {profile.full_name || profile.email}
                  </p>
                  <hr className="my-1 border-slate-200" />
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-slate-600 hover:bg-indigo-50 transition"
                  >
                    Mon profil
                  </Link>
                </div>
              )}
            </>
          ) : (
            <Link
              to="/login/student"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
            >
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
