import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  BookOpen,
  FileText,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  X
} from "lucide-react";
import { supabase } from "../services/supabaseClient";

export default function ModulePage() {
  const { programmeId } = useParams();
  const [programme, setProgramme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModuleId, setOpenModuleId] = useState(null);
  const [selectedLecon, setSelectedLecon] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* ================= YOUTUBE ================= */
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=))([\w-]{11})/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}?rel=0` : null;
  };

  /* ================= FETCH ================= */
  const fetchProgramme = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("programmes")
      .select("*, modules(*, lecons(*))")
      .eq("id", programmeId)
      .single();

    if (!error && data?.modules?.length) {
      const modulesSorted = data.modules.sort((a, b) => a.id - b.id);
      const firstModule = modulesSorted[0];
      const firstLecon = firstModule.lecons?.sort((a, b) => a.id - b.id)[0];

      setProgramme(data);
      setOpenModuleId(firstModule.id);
      setSelectedLecon(firstLecon || null);
    }

    setLoading(false);
  }, [programmeId]);

  useEffect(() => {
    fetchProgramme();
  }, [fetchProgramme]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-400">
        Chargement de votre parcours…
      </div>
    );
  }

  if (!programme) {
    return (
      <div className="text-center mt-20">
        Programme introuvable
      </div>
    );
  }

  const exercices = selectedLecon?.exercice
    ? selectedLecon.exercice.split("||")
    : [];

  const embedUrl = getYouTubeEmbedUrl(selectedLecon?.video_url);

  return (
    <div className="flex flex-col h-screen bg-slate-50">

      {/* ================= HEADER ================= */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/student/programmes">
            <ChevronLeft className="text-slate-600" />
          </Link>
          <h1 className="font-bold text-slate-800 truncate max-w-[200px]">
            {programme.titre}
          </h1>
        </div>

        {/* Bouton mobile */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-sm"
        >
          Chapitres
        </button>
      </header>

      {/* ================= MENU MOBILE ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold">Chapitres</h3>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X />
              </button>
            </div>

            <div className="p-4 space-y-3">
              {programme.modules
                ?.sort((a, b) => a.id - b.id)
                .map((module, idx) => (
                  <div key={module.id} className="border rounded-xl overflow-hidden">
                    <button
                      onClick={() =>
                        setOpenModuleId(openModuleId === module.id ? null : module.id)
                      }
                      className="w-full p-4 flex justify-between bg-slate-50"
                    >
                      <span className="font-semibold text-sm">
                        {idx + 1}. {module.titre}
                      </span>
                      {openModuleId === module.id ? <ChevronUp /> : <ChevronDown />}
                    </button>

                    {openModuleId === module.id &&
                      module.lecons
                        ?.sort((a, b) => a.id - b.id)
                        .map((lecon) => (
                          <button
                            key={lecon.id}
                            onClick={() => {
                              setSelectedLecon(lecon);
                              setQuizAnswers({});
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full px-6 py-3 text-left text-sm ${
                              selectedLecon?.id === lecon.id
                                ? "bg-indigo-50 text-indigo-600 font-bold"
                                : "hover:bg-slate-100"
                            }`}
                          >
                            ▶ {lecon.titre}
                          </button>
                        ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= CONTENU ================= */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR DESKTOP */}
        <aside className="hidden md:block w-80 bg-white border-r overflow-y-auto">
          <div className="p-4 space-y-3">
            {programme.modules
              ?.sort((a, b) => a.id - b.id)
              .map((module, idx) => (
                <div key={module.id} className="border rounded-xl overflow-hidden">
                  <button
                    onClick={() =>
                      setOpenModuleId(openModuleId === module.id ? null : module.id)
                    }
                    className="w-full p-4 flex justify-between hover:bg-slate-50"
                  >
                    <span className="font-semibold text-sm">
                      0{idx + 1} {module.titre}
                    </span>
                    {openModuleId === module.id ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  {openModuleId === module.id &&
                    module.lecons
                      ?.sort((a, b) => a.id - b.id)
                      .map((lecon) => (
                        <button
                          key={lecon.id}
                          onClick={() => {
                            setSelectedLecon(lecon);
                            setQuizAnswers({});
                          }}
                          className={`w-full px-6 py-3 text-left text-sm ${
                            selectedLecon?.id === lecon.id
                              ? "bg-indigo-50 text-indigo-600 font-bold border-r-4 border-indigo-600"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <PlayCircle size={14} className="inline mr-2" />
                          {lecon.titre}
                        </button>
                      ))}
                </div>
              ))}
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto bg-white">
          {selectedLecon ? (
            <div className="max-w-4xl mx-auto p-6 space-y-10">

              <div>
                <span className="text-indigo-600 text-sm font-bold uppercase">
                  Leçon actuelle
                </span>
                <h2 className="text-3xl font-extrabold mt-2">
                  {selectedLecon.titre}
                </h2>
              </div>

              {/* VIDÉO */}
              {embedUrl && (
                <div className="relative pt-[56.25%] rounded-2xl overflow-hidden border shadow">
                  <iframe
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    title={selectedLecon.titre}
                  />
                </div>
              )}

              {/* QUIZ */}
              {selectedLecon.quiz?.length > 0 && (
                <div className="bg-slate-50 p-6 rounded-3xl border">
                  <h3 className="flex items-center gap-2 font-bold mb-6">
                    <HelpCircle /> Quiz
                  </h3>

                  {selectedLecon.quiz.map((q, i) => {
                    const answer = quizAnswers[i];
                    return (
                      <div key={i} className="mb-8">
                        <p className="font-semibold mb-3">
                          {i + 1}. {q.question}
                        </p>

                        {q.options.map((opt) => {
                          const correct = opt === q.answer;
                          const selected = answer === opt;

                          let style = "border bg-white";
                          if (answer) {
                            if (correct) style = "bg-green-100 border-green-500";
                            else if (selected) style = "bg-red-100 border-red-500";
                          }

                          return (
                            <button
                              key={opt}
                              disabled={!!answer}
                              onClick={() =>
                                setQuizAnswers((p) => ({ ...p, [i]: opt }))
                              }
                              className={`block w-full p-4 rounded-xl border-2 text-left mb-2 ${style}`}
                            >
                              {opt}
                              {answer && correct && (
                                <CheckCircle2 className="inline ml-2 text-green-600" />
                              )}
                              {answer && selected && !correct && (
                                <XCircle className="inline ml-2 text-red-600" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* EXERCICES */}
              {exercices.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 font-bold mb-4">
                    <FileText /> Contenu & Exercices
                  </h3>

                  <div className="space-y-4">
                    {exercices.map((ex, i) => (
                      <div
                        key={i}
                        className="p-6 bg-slate-50 rounded-2xl border whitespace-pre-wrap break-words"
                      >
                        {ex}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              <BookOpen size={48} className="opacity-20" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
