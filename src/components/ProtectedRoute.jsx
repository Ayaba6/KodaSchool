import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, profile } = useAuth();

  if (!user) return <Navigate to="/login/student" />;
  if (role && profile?.role !== role) return <Navigate to="/" />;

  return children;
}
