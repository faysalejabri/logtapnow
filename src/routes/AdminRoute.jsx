import { Navigate } from "react-router-dom";
import { isAdmin, isAuthenticated } from "../lib/auth";

const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
