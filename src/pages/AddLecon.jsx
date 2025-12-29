import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams, Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import {
  ArrowLeft,
  PlusCircle,
  Save,
  Loader2,
  PlayCircle,
  HelpCircle,
  BookOpen,
  Trash2,
  Sparkles
} from "lucide-react";

export default function AddLecon() {
  const [titre, setTitre] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [exercices, setExercices] = useState([""]);
  const [quizzes, setQuizzes] = useState([
    { question: "", options: "", answer: "" }
  ]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get("moduleId");
  const { leconId } = useParams();

  /* ================= FONCTION DE NETTOYAGE URL YOUTUBE ================= */
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = "";
    
    // Cas : youtube.com/watch?v=ID
    if (url.includes("v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } 
    // Cas : youtu.be/ID
    else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    }
    // Cas : youtube.com/embed/ID
    else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1].split("?")[0];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  /* ================= FETCH LEÇON (ÉDITION) ================= */
  useEffect(() => {
    if (!leconId) return;

    const fetchLecon = async () => {
      setFetching(true);
      const { data, error } = await supabase
        .from("lecons")
        .select("*")
        .eq("id", leconId)
        .single();

      if (error) {
        alert(error.message);
      } else {
        setTitre(data.titre || "");
        setVideoUrl(data.video_url || "");
        setExercices(data.exercice ? data.exercice.split("||") : [""]);

        if (Array.isArray(data.quiz)) {
          setQuizzes(
            data.quiz.map((q) => ({
              question: q.question || "",
              options: (q.options || []).join(", "),
              answer: q.answer || ""
            }))
          );
        }
      }
      setFetching(false);
    };

    fetchLecon();
  }, [leconId]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      titre,
      module_id: moduleId,
      video_url: videoUrl,
      exercice: exercices.filter(ex => ex.trim() !== "").join("||"),
      quiz: quizzes
        .filter(q => q.question.trim() !== "")
        .map((q) => ({
          question: q.question,
          options: q.options.split(",").map((o) => o.trim()),
          answer: q.answer
        }))
    };

    const { error } = leconId
      ? await supabase.from("lecons").update(payload).eq("id", leconId)
      : await supabase.from("lecons").insert([payload]);

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      navigate(`/teacher/module/${moduleId}`);
    }
  };

  /* ================= HELPERS FORMULAIRE ================= */
  const addQuiz = () => setQuizzes([...quizzes, { question: "", options: "", answer: "" }]);
  const removeQuiz = (index) => {
    const copy = [...quizzes];
    copy.splice(index, 1);
    setQuizzes(copy);
  };
  const handleQuizChange = (index, field, value) => {
    const copy = [...quizzes];
    copy[index][field] = value;
    setQuizzes(copy);
  };
  const addExercice = () => setExercices([...exercices, ""]);
  const removeExercice = (index) => {
    const copy = [...exercices];
    copy.splice(index, 1);
    setExercices(copy);
  };
  const handleExerciceChange = (index, value) => {
    const copy = [...exercices];
    copy[index] = value;
    setExercices(copy);
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to={`/teacher/module/${moduleId}`}
            className="p-2 bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-600 shadow-sm transition-all"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {leconId ? "Modifier la leçon" : "Nouvelle leçon"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* SECTION INFOS */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-indigo-600 font-bold">
                <PlusCircle size={20} /> Informations de base
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Titre</label>
                  <input
                    type="text"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">URL YouTube</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION EXERCICES */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-emerald-600 font-bold">
                <BookOpen size={20} /> Contenu & Exercices
              </div>
              <div className="space-y-4">
                {exercices.map((ex, i) => (
                  <div key={i} className="relative group">
                    <textarea
                      value={ex}
                      onChange={(e) => handleExerciceChange(i, e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[120px] outline-none"
                    />
                    <button type="button" onClick={() => removeExercice(i)} className="absolute top-2 right-2 text-red-400"><Trash2 size={16}/></button>
                  </div>
                ))}
                <button type="button" onClick={addExercice} className="text-emerald-600 font-bold text-sm">+ Ajouter une section</button>
              </div>
            </div>

            {/* SECTION QUIZ */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-amber-500 font-bold">
                <HelpCircle size={20} /> Quiz de validation
              </div>
              <div className="space-y-4">
                {quizzes.map((q, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative">
                    <input type="text" placeholder="Question" value={q.question} onChange={(e) => handleQuizChange(i, "question", e.target.value)} className="w-full mb-2 p-2 border rounded" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="Options (A, B...)" value={q.options} onChange={(e) => handleQuizChange(i, "options", e.target.value)} className="p-2 border rounded" />
                      <input type="text" placeholder="Réponse" value={q.answer} onChange={(e) => handleQuizChange(i, "answer", e.target.value)} className="p-2 border rounded" />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addQuiz} className="text-amber-600 font-bold text-sm">+ Ajouter une question</button>
              </div>
            </div>
          </div>

          {/* SIDEBAR : LECTEUR VIDÉO (CORRIGÉ) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-8">
              <div className="flex items-center gap-2 mb-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
                <Sparkles size={14} /> Aperçu de la vidéo
              </div>
              
              <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-slate-200 shadow-inner">
                {embedUrl ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={embedUrl}
                    title="Aperçu YouTube"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-6 text-center">
                    <PlayCircle size={40} className="mb-2 opacity-20" />
                    <p className="text-xs font-medium">Lien YouTube non reconnu ou vide</p>
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {leconId ? "Enregistrer" : "Publier"}
                </button>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}