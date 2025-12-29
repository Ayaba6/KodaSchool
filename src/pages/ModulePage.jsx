import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  BookOpen, FileText, ChevronLeft, ChevronDown, 
  ChevronUp, PlayCircle, CheckCircle2, XCircle, HelpCircle 
} from "lucide-react";
import { supabase } from "../services/supabaseClient";

export default function ModulePage() {
  const { programmeId } = useParams();
  const [programme, setProgramme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModuleId, setOpenModuleId] = useState(null);
  const [selectedLecon, setSelectedLecon] = useState(null);
  
  // CORRECTION : État du quiz indépendant par question
  // Format : { indexQuestion: "OptionChoisie" }
  const [quizAnswers, setQuizAnswers] = useState({});

  /* ================= LECTURE VIDÉO ROBUSTE ================= */
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w-]{11})/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}?rel=0&modestbranding=1`;
    }
    return null;
  };

  const fetchProgramme = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("programmes")
      .select("*, modules(*, lecons(*))")
      .eq("id", programmeId)
      .single();

    if (error) {
      console.error("Erreur:", error);
    } else {
      setProgramme(data);
      if (data.modules?.length > 0) {
        // Trier les modules par ID ou ordre si nécessaire
        const sortedModules = data.modules.sort((a, b) => a.id - b.id);
        setOpenModuleId(sortedModules[0].id);
        if (sortedModules[0].lecons?.length > 0) {
          setSelectedLecon(sortedModules[0].lecons.sort((a,b) => a.id - b.id)[0]);
        }
      }
    }
    setLoading(false);
  }, [programmeId]);

  useEffect(() => {
    fetchProgramme();
  }, [fetchProgramme]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen text-slate-400">
      Chargement de votre parcours...
    </div>
  );

  if (!programme) return (
    <div className="max-w-md mx-auto mt-20 text-center p-8 bg-white rounded-2xl shadow-sm">
      <p className="text-slate-600 mb-4">Programme introuvable.</p>
      <Link to="/student/programmes" className="text-indigo-600 font-medium flex items-center justify-center gap-2">
        <ChevronLeft size={20} /> Retour aux programmes
      </Link>
    </div>
  );

  const exercices = selectedLecon?.exercice
    ? (Array.isArray(selectedLecon.exercice) ? selectedLecon.exercice : selectedLecon.exercice.split("||"))
    : [];

  const embedUrl = getYouTubeEmbedUrl(selectedLecon?.video_url);

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/student/programmes" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={24} className="text-slate-600" />
          </Link>
          <h1 className="text-lg font-bold text-slate-800">{programme.titre}</h1>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-80 bg-white border-r border-slate-200 overflow-y-auto hidden md:block">
          <div className="p-4 space-y-3">
            {programme.modules?.sort((a,b) => a.id - b.id).map((module, idx) => (
              <div key={module.id} className="border border-slate-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenModuleId(openModuleId === module.id ? null : module.id)}
                  className={`w-full flex items-center justify-between p-4 text-left transition-all ${openModuleId === module.id ? "bg-indigo-50" : "hover:bg-slate-50"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-indigo-400">0{idx + 1}</span>
                    <span className="font-semibold text-slate-700 text-sm leading-tight">{module.titre}</span>
                  </div>
                  {openModuleId === module.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {openModuleId === module.id && (
                  <div className="bg-white py-2 border-t border-slate-50">
                    {module.lecons?.sort((a,b) => a.id - b.id).map((lecon) => (
                      <button
                        key={lecon.id}
                        onClick={() => {
                          setSelectedLecon(lecon);
                          setQuizAnswers({}); // Reset les réponses quand on change de leçon
                        }}
                        className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                          selectedLecon?.id === lecon.id 
                            ? "text-indigo-600 bg-indigo-50/50 border-r-4 border-indigo-600 font-medium" 
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                        }`}
                      >
                        <PlayCircle size={16} className={selectedLecon?.id === lecon.id ? "text-indigo-600" : "text-slate-400"} />
                        {lecon.titre}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* CONTENU PRINCIPAL */}
        <main className="flex-1 overflow-y-auto bg-white">
          {selectedLecon ? (
            <div className="max-w-4xl mx-auto px-6 py-10">
              <div className="mb-8">
                <span className="text-indigo-600 text-sm font-bold tracking-wider uppercase">Leçon actuelle</span>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-2">{selectedLecon.titre}</h2>
              </div>

              {/* ZONE VIDÉO */}
              {embedUrl ? (
                <div className="relative pt-[56.25%] rounded-2xl overflow-hidden shadow-2xl bg-black mb-10 border border-slate-200">
                  <iframe
                    src={embedUrl}
                    title={selectedLecon.titre}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
              ) : selectedLecon.video_url && (
                <div className="p-4 bg-amber-50 text-amber-700 rounded-xl mb-10 text-sm border border-amber-200">
                  Format de lien vidéo non supporté. Utilisez un lien YouTube standard.
                </div>
              )}

              <div className="space-y-12">
                {/* SECTION QUIZ (CORRIGÉE) */}
                {selectedLecon.quiz && Array.isArray(selectedLecon.quiz) && selectedLecon.quiz.length > 0 && (
                  <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-8">
                      <HelpCircle className="text-indigo-500" />
                      <h4 className="font-bold text-slate-800 text-lg">Quiz de révision</h4>
                    </div>

                    {selectedLecon.quiz.map((q, i) => {
                      const selectedOption = quizAnswers[i];
                      const isAnswered = selectedOption !== undefined;

                      return (
                        <div key={i} className="mb-10 last:mb-0">
                          <p className="text-slate-800 mb-4 font-semibold">
                            {i + 1}. {q.question}
                          </p>
                          <div className="grid gap-3">
                            {q.options.map((opt) => {
                              const isCorrect = opt === q.answer;
                              const isSelected = selectedOption === opt;
                              
                              let style = "bg-white border-slate-200 text-slate-700 hover:border-indigo-300";
                              
                              if (isAnswered) {
                                if (isCorrect) style = "bg-green-100 border-green-500 text-green-700 shadow-sm";
                                else if (isSelected) style = "bg-red-100 border-red-500 text-red-700";
                                else style = "bg-white border-slate-100 text-slate-400 opacity-60";
                              }

                              return (
                                <button
                                  key={opt}
                                  disabled={isAnswered}
                                  onClick={() => setQuizAnswers(prev => ({ ...prev, [i]: opt }))}
                                  className={`flex items-center justify-between w-full p-4 rounded-xl border-2 text-left transition-all font-medium ${style}`}
                                >
                                  {opt}
                                  {isAnswered && isCorrect && <CheckCircle2 size={20} className="text-green-600" />}
                                  {isAnswered && isSelected && !isCorrect && <XCircle size={20} className="text-red-600" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* SECTION EXERCICES */}
                {exercices.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-100">
                    <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-4 uppercase text-xs tracking-widest opacity-50">
                      <FileText size={16} /> Contenu & Exercices
                    </h4>
                    <div className="space-y-6">
                      {exercices.map((ex, idx) => (
                        <div key={idx} className="p-6 bg-slate-50 rounded-2xl text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-200">
                          {ex}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <BookOpen size={48} className="mb-4 opacity-10" />
              <p>Sélectionnez une leçon pour commencer</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}