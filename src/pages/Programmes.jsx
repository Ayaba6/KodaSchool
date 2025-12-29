import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Layers, ArrowRight, Search } from "lucide-react";
import { supabase } from "../services/supabaseClient";

export default function Programmes() {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProgrammes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("programmes")
        .select(`
          *,
          modules (id)
        `) // On récupère aussi le compte des modules
        .order("created_at", { ascending: false });

      if (!error) setProgrammes(data);
      setLoading(false);
    };

    fetchProgrammes();
  }, []);

  // Filtrage simple pour la recherche
  const filteredProgrammes = programmes.filter(p => 
    p.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        
        {/* Header avec barre de recherche */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Bibliothèque de Cours <span className="text-indigo-600">(3ᵉ)</span>
          </h1>
          <p className="text-slate-600 text-lg mb-8">
            Accédez à tous vos supports de cours, exercices et quiz en un seul endroit.
          </p>
          
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher une matière..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* État de chargement (Skeletons) */}
        {loading ? (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {filteredProgrammes.map((p) => (
              <Link
                key={p.id}
                to={`/student/programmes/${p.id}`}
                className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white flex flex-col h-full"
              >
                {/* Accent de couleur en haut */}
                <div 
                  className="h-3 w-full" 
                  style={{ backgroundColor: p.color || "#6366f1" }}
                ></div>

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div 
                      className="p-3 rounded-xl text-white shadow-lg"
                      style={{ backgroundColor: p.color || "#6366f1" }}
                    >
                      <BookOpen size={24} />
                    </div>
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Programme Officiel
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">
                    {p.titre}
                  </h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                    {p.description || "Explorez les modules et leçons détaillés pour maîtriser cette matière."}
                  </p>

                  <div className="mt-auto flex items-center gap-4 pt-6 border-t border-slate-50 text-slate-400 text-sm font-medium">
                    <div className="flex items-center gap-1">
                      <Layers size={16} />
                      <span>{p.modules?.length || 0} Modules</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>Libre accès</span>
                    </div>
                  </div>
                </div>

                {/* Overlay au survol pour le bouton */}
                <div className="px-8 py-4 bg-slate-50 flex items-center justify-between text-indigo-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <span>Continuer l'apprentissage</span>
                  <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Message si aucun résultat */}
        {!loading && filteredProgrammes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">Aucun programme ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
}