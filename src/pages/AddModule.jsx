import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate, useSearchParams, useParams, Link } from "react-router-dom";
import { ArrowLeft, LayoutPanelLeft, Palette, Save, Sparkles, Loader2 } from "lucide-react";

export default function AddModule() {
  const [titre, setTitre] = useState("");
  const [color, setColor] = useState("#4f46e5"); // Indigo par défaut
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const programmeId = searchParams.get("programmeId");
  const { moduleId } = useParams();

  useEffect(() => {
    if (!moduleId) return;
    const fetchModule = async () => {
      setFetching(true);
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("id", moduleId)
        .single();
      if (error) alert(error.message);
      else {
        setTitre(data.titre);
        setColor(data.color || "#4f46e5");
      }
      setFetching(false);
    };
    fetchModule();
  }, [moduleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (moduleId) {
      const { error } = await supabase
        .from("modules")
        .update({ titre, color })
        .eq("id", moduleId);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase
        .from("modules")
        .insert([{ titre, color, programme_id: programmeId }]);
      if (error) alert(error.message);
    }
    setLoading(false);
    navigate(`/teacher/programme/${programmeId}`);
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* RETOUR */}
        <Link 
          to={`/teacher/programme/${programmeId}`}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          Retour au programme
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          <div className="p-8 md:p-12">
            
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <LayoutPanelLeft size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {moduleId ? "Modifier le module" : "Nouveau module"}
                </h1>
                <p className="text-slate-500">Organisez votre contenu en chapitres clairs.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* CHAMP TITRE */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
                  Nom du module
                </label>
                <input
                  type="text"
                  placeholder="ex: Les bases de l'arithmétique"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none text-lg font-semibold"
                  required
                />
              </div>

              {/* SÉLECTEUR DE COULEUR & APERÇU */}
              <div className="grid md:grid-cols-2 gap-8 items-end">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 ml-1">
                    <Palette size={16} className="text-slate-400" />
                    Couleur du thème
                  </label>
                  <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border-2 border-slate-100">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border-none bg-transparent"
                    />
                    <span className="font-mono text-sm text-slate-500 uppercase">{color}</span>
                  </div>
                </div>

                {/* MINI APERÇU LIVE */}
                <div className="relative group">
                  <div className="absolute -top-8 left-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles size={10} /> Aperçu carte
                  </div>
                  <div 
                    className="p-4 rounded-2xl border-2 transition-all duration-500"
                    style={{ borderColor: color, backgroundColor: `${color}08` }}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg mb-2 flex items-center justify-center text-white"
                      style={{ backgroundColor: color }}
                    >
                      <LayoutPanelLeft size={16} />
                    </div>
                    <div className="font-bold text-slate-900 truncate">
                      {titre || "Titre du module"}
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-extrabold shadow-xl hover:bg-indigo-600 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <Save size={20} />
                      {moduleId ? "Sauvegarder les modifications" : "Créer le module"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}