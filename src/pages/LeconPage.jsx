import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { ArrowLeft, PlayCircle, BookOpen, CheckCircle } from "lucide-react";

/* =========================================================
   Composant Vidéo (YouTube + MP4)
========================================================= */
function VideoPlayer({ url }) {
  if (!url) {
    return (
      <div className="aspect-video bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 mb-6">
        <PlayCircle size={48} className="mb-2 opacity-20" />
        <p>Aucune vidéo disponible pour cette leçon</p>
      </div>
    );
  }

  let embedUrl = null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=))([\w-]{11})/
  );

  if (match && match[1]) {
    embedUrl = `https://www.youtube.com/embed/${match[1]}?rel=0`;
  }

  if (url.toLowerCase().endsWith(".mp4")) {
    return (
      <div className="rounded-2xl overflow-hidden shadow-lg mb-6 bg-black">
        <video controls className="aspect-video w-full" src={url} />
      </div>
    );
  }

  if (embedUrl) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg mb-8 bg-black">
        <iframe
          src={embedUrl}
          title="Vidéo de la leçon"
          className="absolute inset-0 w-full h-full"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 text-sm">
      Lien vidéo non supporté
    </div>
  );
}

/* =========================================================
   Page Leçon
========================================================= */
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

      if (error) console.error(error);
      else {
        setLecon({
          ...data,
          exercices: data.exercice ? data.exercice.split("||") : [],
        });
      }
      setLoading(false);
    };

    if (leconId) fetchLecon();
  }, [leconId]);

  const handleAnswerChange = (i, value) => {
    setAnswers((prev) => ({ ...prev, [i]: value }));
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(answers).length < lecon.quiz.length) {
      alert("Répondez à toutes les questions.");
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!lecon) return <div className="p-6 text-center">Leçon introuvable</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="max-w-4xl mx-auto p-4 md:p-8">

        {/* Retour */}
        <Link
          to="/student/programmes"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-6"
        >
          <ArrowLeft size={16} /> Retour aux programmes
        </Link>

        {/* Titre */}
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">
          {lecon.titre}
        </h1>

        {/* Vidéo */}
        <VideoPlayer url={lecon.video_url} />

        <div className="grid lg:grid-cols-3 gap-8">

          {/* CONTENU */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-3xl border shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-emerald-600 font-bold">
                <BookOpen size={20} /> Contenu de la leçon
              </div>

              {lecon.exercices.length > 0 ? (
                <div className="space-y-8">
                  {lecon.exercices.map((ex, i) => (
                    <div key={i} className="space-y-3">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs">
                          {i + 1}
                        </span>
                        Chapitre {i + 1}
                      </h3>

                      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap break-words">
                        {ex}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="italic text-slate-400">
                  Aucun contenu pour cette leçon
                </p>
              )}
            </div>
          </div>

          {/* QUIZ */}
          <div className="lg:col-span-1">
            {lecon.quiz?.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border shadow-sm lg:sticky top-8">
                <div className="flex items-center gap-2 mb-6 text-amber-500 font-bold">
                  <CheckCircle size={20} /> Quiz
                </div>

                <div className="space-y-8">
                  {lecon.quiz.map((q, i) => (
                    <div key={i} className="space-y-3">
                      <p className="font-bold">{i + 1}. {q.question}</p>

                      {q.options.map((opt, j) => {
                        const isSelected = answers[i] === opt;
                        const isCorrect = opt === q.answer;

                        let style = "bg-slate-50 border";
                        if (submitted) {
                          if (isCorrect) style = "bg-green-100 border-green-500";
                          else if (isSelected) style = "bg-red-100 border-red-500";
                        } else if (isSelected) {
                          style = "bg-indigo-50 border-indigo-500";
                        }

                        return (
                          <label
                            key={j}
                            className={`block p-3 rounded-xl border-2 cursor-pointer text-sm ${style}`}
                          >
                            <input
                              type="radio"
                              hidden
                              checked={isSelected}
                              disabled={submitted}
                              onChange={() => handleAnswerChange(i, opt)}
                            />
                            {opt}
                          </label>
                        );
                      })}
                    </div>
                  ))}

                  {!submitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold"
                    >
                      Vérifier
                    </button>
                  ) : (
                    <div className="text-center text-indigo-700 font-bold">
                      Quiz terminé 🎉
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
