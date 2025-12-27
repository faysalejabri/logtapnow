import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ClientLoginPage from "./src/pages/ClientLoginPage";
import AdminLoginPage from "./src/pages/AdminLoginPage";
import Dashboard from "./src/pages/dashboard/Dashboard";
import Editor from "./src/pages/editor/Editor";
import ViewCard from "./src/pages/ViewCard";

import ProtectedRoute from "./src/routes/ProtectedRoute";
import AdminRoute from "./src/routes/AdminRoute";

import "@/index.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<ClientLoginPage />} />

        {/* Redirect aliases */}
        <Route path="/client" element={<Navigate to="/" replace />} />
        <Route path="/admin" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Navigate to="/" replace />} />

        {/* Admin login */}
        <Route path="/admindash" element={<AdminLoginPage />} />

        {/* Protected App */}
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
            <AdminRoute>
              <Editor />
            </AdminRoute>
          }
        />

        <Route
          path="/view/:id"
          element={
            <ProtectedRoute>
              <ViewCard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
