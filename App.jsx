import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "@/index.css";
import ClientLoginPage from "./src/pages/ClientLoginPage";
import AdminLoginPage from "./src/pages/AdminLoginPage";
import Dashboard from "./src/pages/dashboard/Dashboard";
import Editor from "./src/pages/editor/Editor";
import ViewCard from "./src/pages/ViewCard";

export const STORAGE_KEY = "vcard_pro_profiles";
export const AUTH_KEY = "vcard_pro_auth";

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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientLoginPage />} />

        {/* Redirect aliases */}
        <Route path="/client" element={<Navigate to="/" replace />} />
        <Route path="/admin" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* Admin */}
        <Route path="/admindash" element={<AdminLoginPage />} />

        {/* App */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit/:id" element={<Editor />} />
        <Route path="/view/:id" element={<ViewCard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
