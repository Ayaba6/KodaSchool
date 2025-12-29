import { Link } from "react-router-dom";
import { 
  PlayCircle, CheckCircle, ArrowRight, Zap, 
  Award, BookOpen, Users 
} from "lucide-react";

// On importe le logo depuis le dossier assets
import logo from "../assets/logo_kodaschool.png"; 

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* Navigation Simple */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* LOGO KODASCHOOL */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src={logo} // Utilisation de la variable importée
              alt="KodaSchool Logo" 
              className="h-20 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          <Link 
            to="/login/student" 
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
          >
            Se connecter
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-3xl opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold mb-6 animate-fade-in">
            <Zap size={16} />
            <span>Spécial Révision BEPC 2025</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight">
            Réussis ton BEPC avec <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              clarté et confiance.
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            La plateforme d'apprentissage qui transforme les leçons complexes en vidéos simples, quiz stimulants et exercices corrigés.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login/student"
              className="group w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              Démarrer gratuitement
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="flex items-center gap-2 text-slate-600 font-semibold hover:text-indigo-600 transition">
              <PlayCircle size={24} />
              Voir une démo
            </button>
          </div>
        </div>
      </section>

      {/* STATS RAPIDES */}
      <section className="border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Élèves inscrits", val: "5000+", icon: <Users /> },
            { label: "Taux de réussite", val: "94%", icon: <Award /> },
            { label: "Vidéos de cours", val: "120+", icon: <PlayCircle /> },
            { label: "Quiz interactifs", val: "400+", icon: <BookOpen /> },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-slate-900">{stat.val}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BÉNÉFICES AVEC VISUEL */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-3xl -z-10 transform rotate-2"></div>
            <div className="bg-white p-2 rounded-3xl shadow-2xl border border-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" 
                alt="Étudiant qui travaille" 
                className="rounded-2xl"
              />
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
              L'école ne devrait pas être <br /> un casse-tête.
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Nous avons conçu KodaSchool pour éliminer la frustration. Chaque leçon est découpée en étapes digestes pour garantir ta réussite.
            </p>

            <ul className="space-y-5">
              {[
                "Explications visuelles ultra-claires",
                "Validation immédiate par quiz",
                "Suivi de progression en temps réel",
                "Accès illimité 24h/24 et 7j/7"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-4 text-slate-700 font-medium">
                  <div className="bg-green-100 text-green-600 p-1 rounded-full">
                    <CheckCircle size={20} />
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ÉTAPES : COMMENT ÇA MARCHE */}
      <section className="bg-slate-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ta route vers le succès</h2>
            <p className="text-slate-400">Trois étapes simples pour transformer tes notes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-[20%] right-[20%] h-0.5 bg-slate-800 -z-0"></div>
            
            {[
              { step: "01", title: "Choisis ta matière", desc: "Tous les programmes officiels de 3ème à portée de main." },
              { step: "02", title: "Apprends en vidéo", desc: "Des cours dynamiques qui vont droit à l'essentiel." },
              { step: "03", title: "Maîtrise le sujet", desc: "Entraîne-toi jusqu'à devenir un expert." },
            ].map((item, i) => (
              <div key={i} className="relative z-10 text-center group">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Prêt à décrocher ton BEPC ?</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">
              Rejoins des milliers d'élèves qui ont déjà choisi une méthode de révision plus intelligente.
            </p>
            <Link
              to="/login/student"
              className="inline-block px-10 py-5 bg-white text-indigo-600 font-extrabold rounded-2xl hover:bg-slate-50 transition shadow-lg"
            >
              Créer mon compte gratuit
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 py-12 text-center text-slate-500">
        <div className="flex justify-center mb-8 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
          <img src={logo} alt="KodaSchool Footer" className="h-8 w-auto" />
        </div>
        
        <div className="flex justify-center gap-6 mb-6">
          <span className="hover:text-indigo-600 cursor-pointer transition">À propos</span>
          <span className="hover:text-indigo-600 cursor-pointer transition">Contact</span>
          <span className="hover:text-indigo-600 cursor-pointer transition">Mentions légales</span>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} KodaSchool. Tous droits réservés.</p>
      </footer>
    </div>
  );
}