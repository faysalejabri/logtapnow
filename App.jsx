import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import ClientLoginPage from "./pages/ClientLoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import ViewCard from "./pages/ViewCard";

// --- Configuration ---
export const STORAGE_KEY = "vcard_pro_profiles";
export const AUTH_KEY = "vcard_pro_auth";

// SECURITY: Only these emails are allowed to access /admindash
export const AUTHORIZED_ADMINS = ["contact@tapnow.ma"];

export const getStoredProfiles = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};
export const saveProfiles = (profiles) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    return true;
  } catch (e) {
    console.error("Storage limit exceeded or error", e);
    alert(
      "Storage limit exceeded! The profile picture might be too large. Try a smaller image."
    );
    return false;
  }
};

export const getSession = () => {
  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : null;
};

// --- Protected Route Wrapper ---
const ProtectedRoute = ({ children }) => {
  const session = getSession();
  if (!session) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// --- Main Router ---
const App = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<ClientLoginPage />} />
        <Route path="/client" element={<Navigate to="/" replace />} />
        {/* Changed from /admin to /admindash */}
        <Route path="/admindash" element={<AdminLoginPage />} />
        {/* Redirect old /admin to new dash or home? Let's hide it completely by redirecting to home */}
        <Route path="/admin" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          }
        />

        {/* Public Card View */}
        <Route path="/view/:id" element={<ViewCard />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
