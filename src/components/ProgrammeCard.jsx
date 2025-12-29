import React from "react";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProgrammeCard({ programme }) {
  return (
    <Link
      to={`/programmes/${programme.id}`}
      className={`group relative overflow-hidden rounded-xl shadow-lg p-6 flex flex-col justify-between transition-transform transform hover:-translate-y-2 hover:shadow-2xl`}
      style={{ background: programme.color }}
    >
      {/* Icône + titre */}
      <div className="flex items-center gap-3 mb-4 text-white">
        <BookOpen size={28} />
        <h3 className="text-2xl font-bold">{programme.titre}</h3>
      </div>

      {/* Description */}
      <p className="text-white/80 mb-6">{programme.description}</p>

      {/* Bouton */}
      <div className="mt-auto">
        <span className="inline-block px-4 py-2 bg-white/20 text-white rounded-lg font-semibold text-sm transition-all group-hover:bg-white/40">
          Voir le programme →
        </span>
      </div>
    </Link>
  );
}
