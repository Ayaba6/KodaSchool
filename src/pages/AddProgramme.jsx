import React, { useState } from "react";
import { supabase } from "../services/supabaseClient.js";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Layout, AlignLeft, Info, Sparkles } from "lucide-react";

export default function AddProgramme() {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase
      .from("programmes")
      .insert([{ titre, description }]);
      
    if (error) {
      alert("Erreur : " + error.message);
      setLoading(false);
    } else {
      navigate("/teacher/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* RETOUR & TITRE */}
        <Link 
          to="/teacher/dashboard" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Retour au tableau de bord
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Créer un Programme</h1>
            <p className="text-slate-500">Définissez les bases de votre nouveau parcours d'apprentissage.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* FORMULAIRE PRINCIPAL */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
              
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <Layout size={16} className="text-indigo-500" />
                  Titre du programme
                </label>
                <input 
                  type="text" 
                  placeholder="ex: Mathématiques - Prépa BEPC" 
                  value={titre} 
                  onChange={(e) => setTitre(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-lg font-medium" 
                  required 
                />
                <p className="mt-2 text-xs text-slate-400">Un titre clair aide les élèves à identifier le sujet immédiatement.</p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <AlignLeft size={16} className="text-indigo-500" />
                  Description détaillée
                </label>
                <textarea 
                  placeholder="Décrivez les objectifs, les chapitres abordés..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none min-h-[150px] resize-none" 
                  required 
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Création..." : (
                    <>
                      <Save size={20} />
                      Publier le programme
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* COLONNE AIDE / APERÇU */}
          <div className="space-y-6">
            {/* APERÇU TEMPS RÉEL */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3">
                <Sparkles className="text-indigo-200" size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Aperçu de la carte</h3>
              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                  <Layout size={20} className="text-indigo-600" />
                </div>
                <h4 className="font-bold text-slate-900 truncate">
                  {titre || "Titre du programme"}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {description || "La description apparaîtra ici..."}
                </p>
              </div>
            </div>

            {/* CONSEILS */}
            <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Info size={20} className="text-indigo-300" />
                <h3 className="font-bold">Conseil Professeur</h3>
              </div>
              <p className="text-sm text-indigo-100 leading-relaxed">
                Les programmes avec une description précise et des objectifs clairs augmentent le taux d'engagement des élèves de 40%.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}