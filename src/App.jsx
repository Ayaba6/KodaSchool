// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";

// Pages publiques
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Register from "./pages/Register.jsx";

// Pages Élève
import Programmes from "./pages/Programmes.jsx";
import ModulePage from "./pages/ModulePage.jsx";

// Pages Professeur
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import AddProgramme from "./pages/AddProgramme.jsx";
import ProgrammeDetail from "./pages/ProgrammeDetail.jsx";
import AddModule from "./pages/AddModule.jsx";
import ModuleDetail from "./pages/ModuleDetail.jsx";
import AddLecon from "./pages/AddLecon.jsx";

export default function App() {
  return (
    <>
      {/* Header commun */}
      <Header />

      {/* Toutes les routes */}
      <div className="pt-16"> {/* padding-top pour que le contenu ne soit pas caché */}
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/student" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />

          {/* ÉLÈVE */}
          <Route path="/student/programmes" element={<Programmes />} />
          <Route path="/student/programmes/:programmeId" element={<ModulePage />} />

          {/* PROFESSEUR */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/programme/new" element={<AddProgramme />} />
          <Route path="/teacher/programme/:programmeId" element={<ProgrammeDetail />} />

          {/* Modules */}
          <Route path="/teacher/module/new" element={<AddModule />} />
          <Route path="/teacher/module/edit/:moduleId" element={<AddModule />} />
          <Route path="/teacher/module/:moduleId" element={<ModuleDetail />} />

          {/* Leçons */}
          <Route path="/teacher/lecon/new" element={<AddLecon />} />
          <Route path="/teacher/lecon/edit/:leconId" element={<AddLecon />} />

          {/* ROUTE PAR DÉFAUT */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
