import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Link } from "react-router-dom";
import { 
  Plus, 
  BookOpen, 
  Users, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  MoreVertical,
  Clock,
  ChevronRight
} from "lucide-react";

export default function TeacherDashboard() {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProgrammes = async () => {
    const { data } = await supabase
      .from("programmes")
      .select("*")
      .order("created_at", { ascending: false });
    setProgrammes(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProgrammes(); }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* SIDEBAR (Fixe à gauche) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <BookOpen size={20} />
            </div>
            KodaSchool
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link to="/teacher/dashboard" className="flex items-center gap-3 p-3 bg-indigo-50 text-indigo-700 rounded-xl font-semibold">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="#" className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-50 rounded-xl transition">
            <Users size={20} /> Mes Élèves
          </Link>
          <Link to="#" className="flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-50 rounded-xl transition">
            <Settings size={20} /> Paramètres
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 w-full rounded-xl transition">
            <LogOut size={20} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 p-4 md:p-8">
        
        {/* HEADER DASHBOARD */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Espace Enseignant</h1>
            <p className="text-slate-500">Gérez vos programmes et suivez vos élèves.</p>
          </div>
          <Link
            to="/teacher/programme/new"
            className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={20} />
            Nouveau programme
          </Link>
        </div>

        {/* STATS RAPIDES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-slate-500 text-sm font-medium mb-1">Total Programmes</div>
            <div className="text-3xl font-bold text-slate-900">{programmes.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-slate-500 text-sm font-medium mb-1">Élèves Actifs</div>
            <div className="text-3xl font-bold text-slate-900">1,284</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-slate-500 text-sm font-medium mb-1">Taux de Complétion</div>
            <div className="text-3xl font-bold text-slate-900">72%</div>
          </div>
        </div>

        {/* LISTE DES PROGRAMMES */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Mes Programmes récents</h2>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {programmes.map(p => (
              <div key={p.id} className="group bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical size={20} />
                </div>
                
                <div className="bg-indigo-50 text-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen size={24} />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {p.titre}
                </h3>
                
                <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                  {p.description || "Aucune description fournie pour ce programme."}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={14} />
                    {new Date(p.created_at).toLocaleDateString()}
                  </div>
                  <Link
                    to={`/teacher/programme/${p.id}`}
                    className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:gap-2 transition-all"
                  >
                    Gérer <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {programmes.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <BookOpen className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-500 font-medium">Vous n'avez pas encore créé de programme.</p>
            <Link to="/teacher/programme/new" className="text-indigo-600 font-bold hover:underline">Créer mon premier cours</Link>
          </div>
        )}
      </main>
    </div>
  );
}