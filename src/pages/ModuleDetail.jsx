import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { 
  ArrowLeft, Plus, Play, Trash2, Edit3, 
  GripVertical, FileText, Video, Loader2, ChevronRight 
} from "lucide-react";

export default function ModuleDetail() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [lecons, setLecons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchModule = async () => {
    setLoading(true);
    const { data: modData, error: modError } = await supabase
      .from("modules")
      .select("*")
      .eq("id", moduleId)
      .single();

    if (modError) {
      alert(modError.message);
      return;
    }
    setModule(modData);

    const { data: leconsData, error: leconsError } = await supabase
      .from("lecons")
      .select("*")
      .eq("module_id", moduleId)
      .order("created_at", { ascending: true });

    if (leconsError) alert(leconsError.message);
    else setLecons(leconsData || []);
    setLoading(false);
  };

  useEffect(() => { fetchModule(); }, [moduleId]);

  const handleDeleteLecon = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer cette leçon ? Cette action est irréversible.")) return;
    const { error } = await supabase.from("lecons").delete().eq("id", id);
    if (error) alert(error.message);
    else fetchModule();
  };

  if (loading && !module) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  const moduleColor = module?.color || "#4f46e5";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER & NAVIGATION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-600 transition-colors shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest text-white" style={{ backgroundColor: moduleColor }}>
                  Module
                </span>
                <span className="text-slate-400 text-sm font-medium italic">Programme ID: {module.programme_id}</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">{module.titre}</h1>
            </div>
          </div>

          <Link
            to={`/teacher/lecon/new?moduleId=${moduleId}`}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-indigo-600 transition-all hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Ajouter une leçon
          </Link>
        </div>

        {/* LISTE DES LEÇONS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <span>Contenu du chapitre</span>
            <span>{lecons.length} Leçons</span>
          </div>

          {lecons.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border-2 border-dashed border-slate-200 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Video size={32} />
              </div>
              <p className="text-slate-500 font-medium mb-4">Ce module est vide pour le moment.</p>
              <Link to={`/teacher/lecon/new?moduleId=${moduleId}`} className="text-indigo-600 font-bold hover:underline">
                Commencer par créer la première leçon
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {lecons.map((l, index) => (
                <div 
                  key={l.id} 
                  className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
                >
                  <div className="text-slate-300 group-hover:text-slate-400 cursor-grab px-1">
                    <GripVertical size={20} />
                  </div>
                  
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${moduleColor}15`, color: moduleColor }}
                  >
                    {l.video_url ? <Video size={18} /> : <FileText size={18} />}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                      <span className="text-slate-300 mr-2 font-mono">0{index + 1}</span>
                      {l.titre}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      {l.video_url && (
                        <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold">VIDEO</span>
                      )}
                      <span className="text-[10px] bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">ID: {l.id.slice(0, 5)}</span>
                    </div>
                  </div>

                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/teacher/lecon/edit/${l.id}?moduleId=${moduleId}`}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      title="Éditer"
                    >
                      <Edit3 size={18} />
                    </Link>
                    <button
                      onClick={() => handleDeleteLecon(l.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="w-px h-8 bg-slate-100 mx-2 self-center"></div>
                    <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CONSEIL RAPIDE */}
        <div className="mt-12 p-6 bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-100 flex items-center gap-6">
           <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Play size={24} fill="currentColor" />
           </div>
           <div>
              <h4 className="font-bold text-slate-900">Aperçu Mode Étudiant</h4>
              <p className="text-sm text-slate-500">Vérifiez comment vos élèves voient ce module en basculant sur la vue démo.</p>
           </div>
           <button className="ml-auto px-5 py-2 text-sm font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-white transition-all">
              Aperçu
           </button>
        </div>
      </div>
    </div>
  );
}