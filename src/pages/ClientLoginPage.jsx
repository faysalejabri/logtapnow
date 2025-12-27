import { AppleBackground } from "@/src/components/apple-background/AppleBackground";
import { AppleInput } from "@/src/components/apple-input/AppleInput";
import { GlassCard } from "@/src/components/glass-card/GlassCard";
import LanguageSwitcher from "@/src/components/language-switcher/LanguageSwitcher";
import { useLanguage } from "@/src/contexts/LanguageContext";
import {
  AlertCircle,
  CreditCard,
  Loader2,
  Mail,
  RefreshCw,
} from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { login } from "@/src/lib/auth";
import { ProfilesContext } from "../contexts/ProfilesContext";

const ClientLoginPage = () => {
  const { t, isRTL } = useLanguage();
  const { profiles } = useContext(ProfilesContext);

  const [id, setId] = useState("ma-001");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleClientLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const user = login(profiles, id, password);

    if (!user) {
      setError(t("errorClient"));
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
            <div className="w-16 h-16 bg-gradient-to-tr from-gray-900 to-gray-700 rounded-[1.2rem] flex items-center justify-center text-white mb-6">
              {isResetMode ? <Mail size={32} /> : <CreditCard size={32} />}
            </div>
            <h2 className="text-3xl font-bold">
              {isResetMode ? "Reset Password" : t("clientLoginTitle")}
            </h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {resetMessage && (
            <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl flex items-center gap-3">
              <RefreshCw size={18} /> {resetMessage}
            </div>
          )}

          {!isResetMode ? (
            <form onSubmit={handleClientLogin} className="space-y-4">
              <AppleInput
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder={t("usernamePlaceholder")}
                required
              />
              <AppleInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("passwordPlaceholder")}
                required
              />

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-4 rounded-full font-semibold"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    t("loginBtn")
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsResetMode(true)}
                  className="px-6 py-4 bg-gray-100 rounded-full text-sm"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => {
                setIsResetMode(false);
                setResetMessage("Mock reset email sent ✔");
              }}
              className="w-full bg-blue-600 text-white py-4 rounded-full"
            >
              Send Reset Link
            </button>
          )}

          {!isResetMode ? (
            <div
              className="mt-6 text-center text-sm text-gray-500 cursor-pointer"
              onClick={() => navigate("/admindash")}
            >
              Swicth to admin mode
            </div>
          ) : null}
        </GlassCard>
      </div>
    </AppleBackground>
  );
};

export default ClientLoginPage;
