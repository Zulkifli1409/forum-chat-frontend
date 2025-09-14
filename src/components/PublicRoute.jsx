import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { user } = useContext(AuthContext);

  // kalau user sudah login → redirect ke /chat
  if (user) {
    return <Navigate to="/chat" replace />;
  }

  return children;
}
