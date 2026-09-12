import { Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext"

export function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Navigate to="/mydrive" replace /> : children;
}