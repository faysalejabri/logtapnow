import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ClientLoginPage from "./src/pages/ClientLoginPage";
import AdminLoginPage from "./src/pages/AdminLoginPage";
import Dashboard from "./src/pages/dashboard/Dashboard";
import Editor from "./src/pages/editor/Editor";
import ViewCard from "./src/pages/ViewCard";
import "@/index.css";

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
