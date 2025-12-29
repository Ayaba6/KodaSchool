import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  BookOpen, FileText, ChevronLeft, ChevronDown, 
  ChevronUp, PlayCircle, CheckCircle2, XCircle, HelpCircle 
} from "lucide-react";
import { supabase } from "../services/supabaseClient";
import ReactPlayer from "react-player";

export default function ModulePage() {
  const { programmeId } = useParams();
  const [programme, setProgramme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModuleId, setOpenModuleId] = useState(null);
  const [selectedLecon, setSelectedLecon] = useState(null);
  const [quizState, setQuizState] = useState({ answered: false, selectedOption: null });

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
      // Ouvrir le premier module et la première leçon par défaut
      if (data.modules?.length > 0) {
        setOpenModuleId(data.modules[0].id);
        if (data.modules[0].lecons?.length > 0) {
          setSelectedLecon(data.modules[0].lecons[0]);
        }
      }
    }
    setLoading(false);
  }, [programmeId]);

  useEffect(() => {
    fetchProgramme();
  }, [fetchProgramme]);

  const handleQuizClick = (option) => {
    if (quizState.answered) return; // Empêcher de changer après réponse
    setQuizState({ answered: true, selectedOption: option });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen animate-pulse text-slate-400">
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

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/student/programmes" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={24} className="text-slate-600" />
          </Link>
          <h1 className="text-lg font-bold text-slate-800">{programme.titre}</h1>
        </div>
        <div className="hidden md:block text-sm text-slate-500 font-medium">
          Progression : {programme.modules?.length} Modules
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar : Navigation du cours */}
        <aside className="w-80 bg-white border-r border-slate-200 overflow-y-auto hidden md:block">
          <div className="p-4 space-y-3">
            {programme.modules?.map((module, idx) => (
              <div key={module.id} className="border border-slate-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenModuleId(openModuleId === module.id ? null : module.id)}
                  className={`w-full flex items-center justify-between p-4 text-left transition-all ${
                    openModuleId === module.id ? "bg-indigo-50" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-indigo-400">0{idx + 1}</span>
                    <span className="font-semibold text-slate-700 text-sm leading-tight">{module.titre}</span>
                  </div>
                  {openModuleId === module.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {openModuleId === module.id && (
                  <div className="bg-white py-2 border-t border-slate-50">
                    {module.lecons?.map((lecon) => (
                      <button
                        key={lecon.id}
                        onClick={() => {
                          setSelectedLecon(lecon);
                          setQuizState({ answered: false, selectedOption: null });
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

        {/* Zone de contenu principale */}
        <main className="flex-1 overflow-y-auto bg-white">
          {selectedLecon ? (
            <div className="max-w-4xl mx-auto px-6 py-10">
              <div className="mb-8">
                <span className="text-indigo-600 text-sm font-bold tracking-wider uppercase">Leçon actuelle</span>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-2">{selectedLecon.titre}</h2>
              </div>

              {/* Vidéo Player Pro */}
              {selectedLecon.video_url && (
                <div className="relative pt-[56.25%] rounded-2xl overflow-hidden shadow-2xl bg-black mb-10 border border-slate-200">
                  <ReactPlayer
                    url={selectedLecon.video_url}
                    controls
                    width="100%"
                    height="100%"
                    className="absolute top-0 left-0"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-8">
                {/* Quiz interactif */}
                {selectedLecon.quiz && (
                  <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                    <div className="flex items-center gap-2 mb-6">
                      <HelpCircle className="text-indigo-500" />
                      <h4 className="font-bold text-slate-800 text-lg">Vérifiez vos connaissances</h4>
                    </div>
                    <p className="text-slate-700 mb-6 font-medium">{selectedLecon.quiz.question}</p>
                    <div className="grid gap-3">
                      {selectedLecon.quiz.options.map((opt) => {
                        const isCorrect = opt === selectedLecon.quiz.answer;
                        const isSelected = quizState.selectedOption === opt;
                        
                        let buttonStyle = "bg-white border-slate-200 text-slate-700 hover:border-indigo-300";
                        if (quizState.answered) {
                          if (isCorrect) buttonStyle = "bg-green-100 border-green-500 text-green-700 shadow-sm";
                          else if (isSelected) buttonStyle = "bg-red-100 border-red-500 text-red-700";
                          else buttonStyle = "bg-white border-slate-100 text-slate-400 opacity-60";
                        }

                        return (
                          <button
                            key={opt}
                            disabled={quizState.answered}
                            onClick={() => handleQuizClick(opt)}
                            className={`flex items-center justify-between w-full p-4 rounded-xl border-2 text-left transition-all font-medium ${buttonStyle}`}
                          >
                            {opt}
                            {quizState.answered && isCorrect && <CheckCircle2 size={20} />}
                            {quizState.answered && isSelected && !isCorrect && <XCircle size={20} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Exercices / Ressources */}
                {selectedLecon.exercice && (
                  <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100">
                    <h4 className="flex items-center gap-2 font-bold text-indigo-900 mb-4 uppercase text-sm tracking-widest">
                      <FileText size={18} /> Travaux Pratiques
                    </h4>
                    <div className="prose prose-indigo text-slate-700">
                      {selectedLecon.exercice}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <BookOpen size={48} className="mb-4 opacity-20" />
              <p>Sélectionnez une leçon dans le menu de gauche pour commencer.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}