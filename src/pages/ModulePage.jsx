import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  CheckCircle2,
  Lock,
  X,
  Menu,
  ArrowRight
} from "lucide-react";
import { supabase } from "../services/supabaseClient";

export default function ModulePage() {
  const { programmeId } = useParams();

  const [programme, setProgramme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModuleId, setOpenModuleId] = useState(null);
  const [selectedLecon, setSelectedLecon] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [progress, setProgress] = useState({});

  const STORAGE_KEY = `progress_${programmeId}`;

  const loadProgress = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  };

  const saveProgress = (leconId) => {
    const updated = { ...progress, [leconId]: true };
    setProgress(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/watch\?v=))([\w-]{11})/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}?rel=0` : null;
  };

  const fetchProgramme = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("programmes")
      .select("*, modules(*, lecons(*))")
      .eq("id", programmeId)
      .single();

    if (data) {
      const modules = data.modules.sort((a, b) => a.id - b.id);
      const allLecons = modules.flatMap(m =>
        m.lecons.sort((a, b) => a.id - b.id)
      );

      setProgramme(data);
      setProgress(loadProgress());
      setOpenModuleId(modules[0]?.id || null);
      setSelectedLecon(allLecons[0] || null);
    }

    setLoading(false);
  }, [programmeId]);

  useEffect(() => {
    fetchProgramme();
  }, [fetchProgramme]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-400">
        Chargement…
      </div>
    );
  }

  if (!programme) {
    return <div className="text-center mt-20">Programme introuvable</div>;
  }

  const allLecons = programme.modules.flatMap(m =>
    m.lecons.sort((a, b) => a.id - b.id)
  );

  const currentIndex = allLecons.findIndex(
    l => l.id === selectedLecon?.id
  );

  const nextLecon =
    currentIndex >= 0 && currentIndex < allLecons.length - 1
      ? allLecons[currentIndex + 1]
      : null;

  const isUnlocked = (leconId) => {
    const index = allLecons.findIndex(l => l.id === leconId);
    if (index === 0) return true;
    return progress[allLecons[index - 1].id];
  };

  const embedUrl = getYouTubeEmbedUrl(selectedLecon?.video_url);

  const goToNextLecon = () => {
    if (!nextLecon) return;
    setSelectedLecon(nextLecon);
    setOpenModuleId(nextLecon.module_id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex h-screen bg-slate-100">

      {/* ===== SIDEBAR PC ===== */}
      <aside
        className={`hidden md:flex bg-white border-r transition-all duration-300
        ${sidebarOpen ? "w-80" : "w-0 overflow-hidden"}`}
      >
        <div className="w-80 overflow-y-auto">
          <div className="p-4 border-b font-bold">{programme.titre}</div>

          {programme.modules.map(module => (
            <div key={module.id} className="border-b">
              <button
                onClick={() =>
                  setOpenModuleId(openModuleId === module.id ? null : module.id)
                }
                className="w-full p-4 text-left font-semibold hover:bg-slate-50"
              >
                {module.titre}
              </button>

              {openModuleId === module.id &&
                module.lecons.map(lecon => {
                  const locked = !isUnlocked(lecon.id);
                  return (
                    <button
                      key={lecon.id}
                      disabled={locked}
                      onClick={() => setSelectedLecon(lecon)}
                      className={`w-full px-6 py-3 text-sm flex justify-between items-center
                        ${locked ? "text-slate-400" : "hover:bg-indigo-50"}`}
                    >
                      {lecon.titre}
                      {progress[lecon.id] ? (
                        <CheckCircle2 size={16} className="text-green-500" />
                      ) : locked ? (
                        <Lock size={16} />
                      ) : null}
                    </button>
                  );
                })}
            </div>
          ))}
        </div>
      </aside>

      {/* ===== CONTENU ===== */}
      <div className="flex-1 flex flex-col bg-white">

        {/* HEADER */}
        <header className="flex items-center justify-between p-4 border-b sticky top-0 z-40 bg-white">
          <div className="flex items-center gap-3">
            <Link to="/student/programmes" className="p-2 hover:bg-slate-100 rounded-lg">
              <ChevronLeft />
            </Link>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex p-2 hover:bg-slate-100 rounded-lg"
            >
              <Menu />
            </button>

            <h1 className="font-bold text-lg truncate">{selectedLecon?.titre}</h1>
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold"
          >
            Chapitres
          </button>
        </header>

        {/* ===== SIDEBAR MOBILE ===== */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <aside
              className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex justify-between items-center font-bold">
                {programme.titre}
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X />
                </button>
              </div>

              {programme.modules.map(module => (
                <div key={module.id} className="border-b">
                  <button
                    onClick={() =>
                      setOpenModuleId(openModuleId === module.id ? null : module.id)
                    }
                    className="w-full p-4 text-left font-semibold hover:bg-slate-50"
                  >
                    {module.titre}
                  </button>

                  {openModuleId === module.id &&
                    module.lecons.map(lecon => {
                      const locked = !isUnlocked(lecon.id);
                      return (
                        <button
                          key={lecon.id}
                          disabled={locked}
                          onClick={() => {
                            setSelectedLecon(lecon);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full px-6 py-3 text-sm flex justify-between items-center
                            ${locked ? "text-slate-400" : "hover:bg-indigo-50"}`}
                        >
                          {lecon.titre}
                          {progress[lecon.id] ? (
                            <CheckCircle2 size={16} className="text-green-500" />
                          ) : locked ? (
                            <Lock size={16} />
                          ) : null}
                        </button>
                      );
                    })}
                </div>
              ))}
            </aside>
          </div>
        )}

        {/* ===== LEÇON ===== */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-8">

            {embedUrl && (
              <div className="relative pt-[56.25%] rounded-2xl overflow-hidden border">
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                />
              </div>
            )}

            {selectedLecon?.exercice && (
              <div className="bg-slate-50 border rounded-xl p-6 whitespace-pre-wrap">
                {selectedLecon.exercice}
              </div>
            )}

            {!progress[selectedLecon.id] ? (
              <button
                onClick={() => saveProgress(selectedLecon.id)}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl"
              >
                Marquer comme terminée ✔
              </button>
            ) : nextLecon ? (
              <button
                onClick={goToNextLecon}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2"
              >
                Leçon suivante
                <ArrowRight />
              </button>
            ) : (
              <div className="text-center p-6 bg-emerald-50 rounded-2xl font-bold text-emerald-700">
                🎉 Félicitations, vous avez terminé ce module !
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
