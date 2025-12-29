import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { 
  ArrowLeft, Plus, Settings, Layers, 
  Trash2, Edit3, Eye, Loader2, ChevronRight,
  BookOpen, Calendar, Info
} from "lucide-react";

export default function ProgrammeDetail() {
  const { programmeId } = useParams();
  const navigate = useNavigate();
  const [programme, setProgramme] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProgramme = async () => {
    setLoading(true);
    const { data: progData, error: progError } = await supabase
      .from("programmes")
      .select("*")
      .eq("id", programmeId)
      .single();

    if (progError) {
      alert(progError.message);
      return;
    }
    setProgramme(progData);

    const { data: modulesData, error: modulesError } = await supabase
      .from("modules")
      .select("*")
      .eq("programme_id", programmeId)
      .order("created_at", { ascending: true });

    if (modulesError) alert(modulesError.message);
    else setModules(modulesData || []);
    setLoading(false);
  };

  useEffect(() => { fetchProgramme(); }, [programmeId]);

  const handleDeleteModule = async (id) => {
    if (!confirm("Attention : Supprimer ce module supprimera également toutes les leçons associées. Continuer ?")) return;
    const { error } = await supabase.from("modules").delete().eq("id", id);
    if (error) alert(error.message);
    else fetchProgramme();
  };

  if (loading && !programme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* TOP BAR / BREADCRUMBS */}
        <div className="flex items-center gap-3 mb-8 text-sm font-medium text-slate-500">
          <Link to="/teacher/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
          <ChevronRight size={14} />
          <span className="text-slate-900 truncate max-w-[200px]">{programme.titre}</span>
        </div>

        {/* HEADER SECTION */}
        <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-slate-100 -z-0">
             <BookOpen size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  {programme.titre}
                </h1>
                <p className="text-slate-500 text-lg leading-relaxed">
                  {programme.description}
                </p>
                <div className="flex items-center gap-6 mt-6 text-sm text-slate-400 font-medium">
                  <span className="flex items-center gap-2">
                    <Layers size={16} /> {modules.length} Modules
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar size={16} /> Créé le {new Date(programme.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/teacher/module/new?programmeId=${programmeId}`}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  <Plus size={18} /> Ajouter un module
                </Link>
                <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 transition-colors border border-slate-100">
                  <Settings size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MODULES LIST */}
        <div className="grid gap-4">
          <h2 className="text-xl font-bold text-slate-800 mb-2 ml-2">Architecture du programme</h2>
          
          {modules.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 border-2 border-dashed border-slate-200 text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-200">
                <Layers size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun module pour le moment</h3>
              <p className="text-slate-500 mb-6">Commencez par diviser votre programme en chapitres ou thématiques.</p>
              <Link to={`/teacher/module/new?programmeId=${programmeId}`} className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline">
                Créer le premier module <ChevronRight size={18} />
              </Link>
            </div>
          ) : (
            modules.map((m, index) => (
              <div 
                key={m.id} 
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-5">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-inner"
                    style={{ backgroundColor: m.color || '#4f46e5' }}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{m.titre}</h3>
                    <p className="text-slate-400 text-sm flex items-center gap-2">
                       <Info size={14} /> Cliquez sur "Gérer les leçons" pour ajouter du contenu
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <Link
                    to={`/teacher/module/${m.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-sm font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100"
                  >
                    <Eye size={16} /> Gérer les leçons
                  </Link>
                  <Link
                    to={`/teacher/module/edit/${m.id}?programmeId=${programmeId}`}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  >
                    <Edit3 size={18} />
                  </Link>
                  <button
                    onClick={() => handleDeleteModule(m.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER INFO */}
        <div className="mt-12 text-center text-slate-400 text-sm">
          <p>ID Programme: {programmeId}</p>
        </div>
      </div>
    </div>
  );
}