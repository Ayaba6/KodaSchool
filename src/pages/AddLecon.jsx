import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams, Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { 
  ArrowLeft, Video, HelpCircle, BookOpen, 
  Save, Loader2, PlayCircle, PlusCircle, AlertCircle
} from "lucide-react";

export default function AddLecon() {
  const [titre, setTitre] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState("");
  const [answer, setAnswer] = useState("");
  const [exercice, setExercice] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get("moduleId");
  const { leconId } = useParams();

  useEffect(() => {
    if (!leconId) return;
    const fetchLecon = async () => {
      setFetching(true);
      const { data, error } = await supabase
        .from("lecons")
        .select("*")
        .eq("id", leconId)
        .single();
      if (error) alert(error.message);
      else {
        setTitre(data.titre);
        setVideoUrl(data.video_url || "");
        setExercice(data.exercice || "");
        if (data.quiz) {
          setQuestion(data.quiz.question || "");
          setOptions((data.quiz.options || []).join(","));
          setAnswer(data.quiz.answer || "");
        }
      }
      setFetching(false);
    };
    fetchLecon();
  }, [leconId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const quiz = question ? { question, options: options.split(",").map(o => o.trim()), answer } : null;

    const payload = { titre, module_id: moduleId, video_url: videoUrl, quiz, exercice };

    const { error } = leconId 
      ? await supabase.from("lecons").update(payload).eq("id", leconId)
      : await supabase.from("lecons").insert([payload]);

    if (error) alert(error.message);
    else navigate(`/teacher/module/${moduleId}`);
    setLoading(false);
  };

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={`/teacher/module/${moduleId}`} className="p-2 bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-600 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {leconId ? "Éditer la leçon" : "Nouvelle leçon"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECTION 1 : GÉNÉRAL */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-indigo-600 font-bold">
              <PlusCircle size={20} />
              Informations Générales
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Titre de la leçon</label>
                <input
                  type="text"
                  placeholder="ex: Introduction au Théorème de Pythagore"
                  value={titre}
                  onChange={e => setTitre(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Lien de la Vidéo (YouTube / Vimeo)</label>
                <div className="relative">
                  <PlayCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="url"
                    placeholder="https://youtube.com/..."
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2 : QUIZ RAPIDE */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-amber-500 font-bold">
              <HelpCircle size={20} />
              Quiz de Validation
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Quelle est la question ?"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Options (ex: A, B, C, D)"
                  value={options}
                  onChange={e => setOptions(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Réponse correcte"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <AlertCircle size={12} /> Séparez les options par des virgules.
              </p>
            </div>
          </div>

          {/* SECTION 3 : EXERCICE */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-emerald-600 font-bold">
              <BookOpen size={20} />
              Contenu de l'exercice
            </div>
            <textarea
              placeholder="Rédigez ici l'exercice complet ou les instructions..."
              value={exercice}
              onChange={e => setExercice(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none min-h-[150px] font-serif"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-10 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {leconId ? "Mettre à jour" : "Créer la leçon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}