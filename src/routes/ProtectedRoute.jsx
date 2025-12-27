import { Navigate } from "react-router-dom";
import { getCurrentUser, isAdmin, isAuthenticated } from "../lib/auth";

const ProtectedRoute = ({ children }) => {
  const user = getCurrentUser();

  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to={`/edit/${user.id}`} replace state={user} />;
  }

  return children;
};

export default ProtectedRoute;
