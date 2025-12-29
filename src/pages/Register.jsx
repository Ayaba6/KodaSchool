import { useState } from "react";
import { supabase } from "../services/supabaseClient.js";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import logo from "../assets/logo_kodaschool.png";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Inscription avec Supabase
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      // Créer le profil avec rôle et nom complet
      const { error: profileError } = await supabase.from("profiles").insert([
        { id: user.id, role, full_name: fullName }
      ]);

      if (profileError) throw profileError;

      // Rediriger selon le rôle
      if (role === "student") navigate("/student/programmes");
      else if (role === "teacher") navigate("/teacher/dashboard");

    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Côté gauche pour image et texte */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-600">
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
          alt="Étudiants" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
        />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <img src={logo} alt="Logo" className="h-16 w-auto mb-10 self-start brightness-0 invert" />
          <h2 className="text-4xl font-extrabold mb-6 leading-tight">
            Rejoins KodaSchool et booste tes résultats !
          </h2>
          <p className="text-indigo-100 text-lg max-w-md">
            Crée ton compte pour accéder aux cours, quiz et exercices pour réussir ton BEPC.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-900/50 to-transparent"></div>
      </div>

      {/* Côté droit : formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <img src={logo} alt="KodaSchool" className="h-12 w-auto" />
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Inscription</h1>
            <p className="text-slate-500">Crée ton compte pour commencer à apprendre</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Nom complet</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Ton nom complet"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Rôle</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="student">Élève</option>
                <option value="teacher">Professeur</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "S'inscrire"}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-600 text-sm">
            Déjà un compte ?{" "}
            <Link to="/login/student" className="text-indigo-600 font-bold hover:underline">
              Connecte-toi
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
