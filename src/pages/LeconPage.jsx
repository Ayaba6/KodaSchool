import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { ArrowLeft, PlayCircle, BookOpen, CheckCircle } from "lucide-react";

// Composant vidéo robuste pour YouTube et MP4
function VideoPlayer({ url }) {
  if (!url) {
    return (
      <div className="aspect-video bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 mb-6">
        <PlayCircle size={48} className="mb-2 opacity-20" />
        <p>Aucune vidéo disponible pour cette leçon</p>
      </div>
    );
  }

  // Logique d'extraction de l'ID YouTube améliorée
  let embedUrl = null;
  const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w-]{11})/);
  
  if (videoIdMatch && videoIdMatch[1]) {
    embedUrl = `https://www.youtube.com/embed/${videoIdMatch[1]}?rel=0&modestbranding=1`;
  }

  // Si c'est un fichier MP4 direct
  if (url.toLowerCase().endsWith(".mp4")) {
    return (
      <div className="rounded-2xl overflow-hidden shadow-lg mb-6 bg-black">
        <video controls width="100%" src={url} className="aspect-video" />
      </div>
    );
  }

  // Si c'est une URL YouTube valide
  if (embedUrl) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg mb-8 bg-black border border-slate-200">
        <iframe
          src={embedUrl}
          title="Vidéo de la leçon"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    );
  }

  // Fallback si l'URL ne correspond à rien de connu
  return (
    <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 text-sm">
      Le format du lien vidéo n'est pas supporté.
    </div>
  );
}

export default function LeconPage() {
  const { leconId } = useParams();
  const [lecon, setLecon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchLecon = async () => {
      const { data, error } = await supabase
        .from("lecons")
        .select("*")
        .eq("id", leconId)
        .single();

      if (error) {
        console.error(error.message);
      } else {
        setLecon({
          ...data,
          exercices: data.exercice ? data.exercice.split("||") : [],
        });
      }
      setLoading(false);
    };

    if (leconId) fetchLecon();
  }, [leconId]);

  const handleAnswerChange = (qIndex, value) => {
    setAnswers(prev => ({ ...prev, [qIndex]: value }));
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(answers).length < lecon.quiz.length) {
      alert("Veuillez répondre à toutes les questions avant de soumettre.");
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!lecon) {
    return <div className="p-8 text-center">Leçon introuvable.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* Navigation */}
        <Link 
          to="/student/programmes" 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Retour aux programmes
        </Link>

        {/* Header */}
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">{lecon.titre}</h1>

        {/* LECTEUR VIDÉO */}
        <VideoPlayer url={lecon.video_url} />

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Contenu principal : Exercices et Texte */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6 text-emerald-600 font-bold">
                <BookOpen size={20} /> Contenu de la leçon
              </div>
              
              {lecon.exercices && lecon.exercices.length > 0 ? (
                <div className="space-y-8">
                  {lecon.exercices.map((ex, i) => (
                    <div key={i} className="prose prose-slate max-w-none">
                      <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs">
                          {i + 1}
                        </span>
                        Section {i + 1}
                      </h3>
                      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {ex}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic">Aucun texte additionnel pour cette leçon.</p>
              )}
            </div>
          </div>

          {/* Sidebar : Quiz */}
          <div className="lg:col-span-1">
            {lecon.quiz?.length > 0 && (
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-8">
                <div className="flex items-center gap-2 mb-6 text-amber-500 font-bold">
                  <CheckCircle size={20} /> Quiz Rapide
                </div>

                <div className="space-y-8">
                  {lecon.quiz.map((q, i) => (
                    <div key={i} className="space-y-3">
                      <p className="font-bold text-slate-800 leading-tight">
                        {i + 1}. {q.question}
                      </p>
                      <div className="flex flex-col gap-2">
                        {q.options.map((opt, j) => {
                          const isCorrect = opt === q.answer;
                          const isSelected = answers[i] === opt;
                          
                          let bgClass = "bg-slate-50 border-slate-200 hover:border-indigo-300";
                          if (submitted) {
                            if (isCorrect) bgClass = "bg-green-100 border-green-500 text-green-700";
                            else if (isSelected) bgClass = "bg-red-100 border-red-500 text-red-700";
                            else bgClass = "bg-slate-50 border-slate-100 opacity-50";
                          } else if (isSelected) {
                            bgClass = "bg-indigo-50 border-indigo-500 text-indigo-700";
                          }

                          return (
                            <label
                              key={j}
                              className={`px-4 py-3 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-3 text-sm font-medium ${bgClass}`}
                            >
                              <input
                                type="radio"
                                name={`quiz-${i}`}
                                value={opt}
                                disabled={submitted}
                                checked={isSelected}
                                onChange={(e) => handleAnswerChange(i, e.target.value)}
                                className="hidden"
                              />
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-indigo-500' : 'border-slate-300'}`}>
                                {isSelected && <div className="w-2 h-2 rounded-full bg-indigo-500" />}
                              </div>
                              {opt}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {!submitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                    >
                      Vérifier mes réponses
                    </button>
                  ) : (
                    <div className="p-4 bg-indigo-50 rounded-2xl text-center">
                      <p className="text-indigo-700 font-bold">Quiz terminé !</p>
                      <p className="text-indigo-600 text-xs mt-1">Les bonnes réponses sont en vert.</p>
                      <button 
                        onClick={() => { setSubmitted(false); setAnswers({}); }}
                        className="mt-4 text-xs font-bold text-indigo-400 hover:underline"
                      >
                        Recommencer le quiz
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}