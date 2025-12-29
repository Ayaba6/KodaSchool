import React from "react";
import { useParams, Link } from "react-router-dom";

const fakeLecons = {
  m1: { id: "m1", titre: "Les fractions — Leçon 1", contenu: "<p>Les fractions représentent une partie d'un tout...</p>" },
  m2: { id: "m2", titre: "Géométrie — Angles", contenu: "<p>Un angle se mesure en degrés...</p>" },
};

export default function LeconPage() {
  const { leconId } = useParams();
  const lecon = fakeLecons[leconId] || { titre: "Leçon introuvable", contenu: "<p>Pas de contenu.</p>" };

  return (
    <div>
      <Link to="/programmes" className="text-sm text-slate-600 hover:underline">← Retour</Link>
      <h2 className="text-2xl font-bold mt-4 mb-2">{lecon.titre}</h2>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lecon.contenu }} />
    </div>
  );
}
