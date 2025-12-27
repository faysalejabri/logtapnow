import { AppleBackground } from "@/src/components/apple-background/AppleBackground";
import { AppleInput } from "@/src/components/apple-input/AppleInput";
import { GlassCard } from "@/src/components/glass-card/GlassCard";
import LanguageSwitcher from "@/src/components/language-switcher/LanguageSwitcher";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { AlertCircle, Loader2, Shield } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "@/src/lib/auth";

const AdminLoginPage = () => {
  const { t, isRTL } = useLanguage();
  const [id, setId] = useState("admin-001");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const user = login(id, password);

    if (!user || user.role !== "admin") {
      setError("Invalid admin credentials");
      setIsLoading(false);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <AppleBackground>
      <div
        className="min-h-screen flex items-center justify-center p-6"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="absolute top-6 right-6">
          <LanguageSwitcher />
        </div>

        <GlassCard className="w-full max-w-[420px] p-10">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-[1.2rem] shadow-lg flex items-center justify-center text-white mb-6">
              <Shield size={32} />
            </div>
            <h2 className="text-3xl font-bold">{t("adminLoginTitle")}</h2>
            <p className="text-gray-500 mt-2">{t("secureConnection")}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <AppleInput
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Admin ID"
              required
            />
            <AppleInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-4 rounded-full font-semibold"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : t("loginBtn")}
            </button>
          </form>

          <div
            className="mt-6 text-center text-sm text-gray-500 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Swicth to client mode
          </div>
        </GlassCard>
      </div>
    </AppleBackground>
  );
};

export default AdminLoginPage;
