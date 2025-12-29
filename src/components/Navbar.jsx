import React from "react";
import { BookOpen } from "lucide-react"; // import de l’icône

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen size={28} /> KodaSchool
        </h1>
      </div>
    </header>
  );
}
