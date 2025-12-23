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
import { useState } from "react";
import { useNavigate } from "react-router";

const ClientLoginPage = () => {
  const { t, isRTL } = useLanguage();
  const [username, setUsername] = useState("ayoub");
  const [password, setPassword] = useState("ayoub123");
  const [error, setError] = useState("");

  // Forgot Password States
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleClientLogin = (e) => {
    e.preventDefault();
    // const profiles = getStoredProfiles();
    // const client = profiles.find(
    //   (p) => p.id === username.trim() && p.password === password.trim()
    // );

    // const client = { id: username.trim(), password: password.trim() };

    // if (client) {
    //   const session = { role: "client", id: client.id };
    //   localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    navigate("/dashboard");
    // } else {
    //   setError(t("errorClient"));
    // }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;

    setIsLoading(true);
    setError("");
    setResetMessage("");

    try {
      //   // Use modular method
      //   await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("Check your inbox! We've sent a password reset link.");
      setResetEmail("");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
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

        <GlassCard className="w-full max-w-[420px] p-10 animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-gray-900 to-gray-700 rounded-[1.2rem] shadow-lg flex items-center justify-center text-white mb-6">
              {isResetMode ? (
                <Mail size={32} strokeWidth={2} />
              ) : (
                <CreditCard size={32} strokeWidth={2} />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {isResetMode ? "Reset Password" : t("clientLoginTitle")}
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              {isResetMode
                ? "Enter your email to receive instructions"
                : t("loginDesc")}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm text-red-600 text-sm font-medium rounded-2xl flex items-center gap-3 animate-pulse">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {resetMessage && (
            <div className="mb-6 p-4 bg-green-50/80 backdrop-blur-sm text-green-600 text-sm font-medium rounded-2xl flex items-center gap-3">
              <RefreshCw size={18} /> {resetMessage}
            </div>
          )}

          {/* RESET PASSWORD FORM */}
          {isResetMode ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <AppleInput
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-full transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 mt-4 text-lg flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setError("");
                  setResetMessage("");
                }}
                className="w-full mt-4 text-gray-500 hover:text-gray-900 font-medium text-sm transition-colors"
              >
                {t("back")}
              </button>
            </form>
          ) : (
            /* LOGIN FORM */
            <form onSubmit={handleClientLogin} className="space-y-4">
              <AppleInput
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

              <div className="flex gap-4 items-center mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-full transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 text-lg"
                >
                  {t("loginBtn")}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsResetMode(true);
                    setError("");
                  }}
                  className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-full transition-all duration-300 text-sm whitespace-nowrap"
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center space-y-2">
            <p className="text-xs text-gray-400 font-medium">
              {t("contactAdmin")}
            </p>
          </div>
        </GlassCard>
      </div>
    </AppleBackground>
  );
};

export default ClientLoginPage;
