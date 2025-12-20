import { AUTH_KEY, AUTHORIZED_ADMINS } from "@/App";
import { AppleBackground } from "@/src/components/apple-background/AppleBackground";
import { AppleInput } from "@/src/components/apple-input/AppleInput";
import { GlassCard } from "@/src/components/glass-card/GlassCard";
import LanguageSwitcher from "@/src/components/language-switcher/LanguageSwitcher";
import { useLanguage } from "@/src/contexts/LanguageContext";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { AlertCircle, Loader2, RefreshCw, Shield } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

// --- Admin Login Page ---
const AdminLoginPage = () => {
  console.log(":::::: hello");
  const { t, isRTL } = useLanguage();
  // Pre-filled credentials as requested
  const [email, setEmail] = useState("faysale.jabri@gmail.com");
  const [password, setPassword] = useState("Hello@2025");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Authenticate with Firebase (Modular SDK syntax)
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Authorization Check (Role Enforcement)
      if (user && user.email && !AUTHORIZED_ADMINS.includes(user.email)) {
        // Not an admin
        await signOut(auth);
        throw new Error("You are not an authorized administrator.");
      }

      // 3. Success - Set Local Session
      const session = { role: "admin" };
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      if (err.message === "You are not an authorized administrator.") {
        setError(err.message);
      } else if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Try again later.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(err.message || t("errorAdmin"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }

    setIsLoading(true);
    try {
      // Use modular method
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError("");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        setError("No admin account found with this email.");
      } else {
        setError(err.message || "Failed to send reset email.");
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
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-[1.2rem] shadow-lg flex items-center justify-center text-white mb-6">
              <Shield size={32} strokeWidth={2} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {t("adminLoginTitle")}
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              {t("secureConnection")}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm text-red-600 text-sm font-medium rounded-2xl flex items-center gap-3 animate-pulse">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {resetSent && (
            <div className="mb-6 p-4 bg-green-50/80 backdrop-blur-sm text-green-600 text-sm font-medium rounded-2xl flex items-center gap-3">
              <RefreshCw size={18} /> Password reset link sent to your email.
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <AppleInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Email"
              required
            />
            <AppleInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-4 text-lg flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : t("loginBtn")}
            </button>
          </form>
        </GlassCard>
      </div>
    </AppleBackground>
  );
};

export default AdminLoginPage;
