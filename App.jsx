import { useState, useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";
// import { VCardProfile } from "./types";
import { DEFAULT_PROFILE } from "./constants";
import PhonePreview from "./components/PhonePreview";
import EditorForm from "./components/EditorForm";
import Button from "./components/Button";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useLanguage } from "./contexts/LanguageContext";
import {
  Plus,
  LayoutGrid,
  Eye,
  ArrowLeft,
  CreditCard,
  Users,
  LogOut,
  Lock,
  Key,
  Copy,
  X,
  RefreshCw,
  AlertCircle,
  Shield,
  ChevronRight,
  Loader2,
  Mail,
  ArrowRight,
} from "lucide-react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

// --- Configuration ---
const STORAGE_KEY = "vcard_pro_profiles";
const AUTH_KEY = "vcard_pro_auth";

// SECURITY: Only these emails are allowed to access /admindash
const AUTHORIZED_ADMINS = ["contact@tapnow.ma"];

const getStoredProfiles = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};
const saveProfiles = (profiles) => {
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

// --- Auth Utilities ---
// interface UserSession {
//   role: "admin" | "client";
//   id?;
// }

const getSession = () => {
  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : null;
};

// --- Design Components ---
// Apple-style background with blurred orbs
const AppleBackground = ({ children }) => (
  <div className="min-h-screen bg-[#F5F5F7] relative overflow-hidden font-sans selection:bg-blue-500/30">
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] animate-pulse delay-1000" />
    <div className="relative z-10 w-full h-full">{children}</div>
  </div>
);

// Glass Card Component
const GlassCard = ({ children, className = "" }) => (
  <div
    className={`bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[2.5rem] ${className}`}
  >
    {children}
  </div>
);

// Apple-style Input
const AppleInput = ({ ...props }) => (
  <input
    {...props}
    className="w-full px-5 py-4 bg-gray-100/50 hover:bg-white/80 focus:bg-white border border-transparent focus:border-blue-500/30 rounded-2xl outline-none transition-all duration-300 text-gray-900 placeholder:text-gray-400 text-lg shadow-inner"
  />
);

// --- Admin Login Page ---
const AdminLoginPage = () => {
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

// --- Client Login Page ---
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

    const client = { id: username.trim(), password: password.trim() };

    if (client) {
      const session = { role: "client", id: client.id };
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      navigate("/dashboard");
    } else {
      setError(t("errorClient"));
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;

    setIsLoading(true);
    setError("");
    setResetMessage("");

    try {
      // Use modular method
      await sendPasswordResetEmail(auth, resetEmail);
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
              {t("contactAdmin")}{" "}
              <span className="text-gray-800">{AUTHORIZED_ADMINS[0]}</span>
            </p>
          </div>
        </GlassCard>
      </div>
    </AppleBackground>
  );
};

// --- Protected Route Wrapper ---
const ProtectedRoute = ({ children }) => {
  const session = getSession();
  if (!session) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// --- Dashboard Component ---
const Dashboard = () => {
  const { t, isRTL } = useLanguage();
  const [profiles, setProfiles] = useState([]);
  const [session, setSession] = useState(null);
  const [selectedCredentialProfile, setSelectedCredentialProfile] =
    useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      navigate("/");
      return;
    }
    setSession(currentSession);

    const allProfiles = getStoredProfiles();

    // If client, redirect immediately to their editor
    if (currentSession.role === "client" && currentSession.id) {
      navigate(`/edit/${currentSession.id}`);
      return;
    }

    setProfiles(allProfiles);
  }, [navigate]);

  const handleLogout = async () => {
    const role = session?.role;
    if (role === "admin") {
      try {
        await signOut(auth);
      } catch (e) {
        console.error("Error signing out from firebase", e);
      }
    }
    localStorage.removeItem(AUTH_KEY);
    // Redirect Admin to /admindash, Client to /
    navigate(role === "admin" ? "/admindash" : "/");
  };

  const createNewProfile = () => {
    const id = Date.now().toString();
    const password = Math.random().toString(36).slice(-8);
    const newProfile = {
      ...DEFAULT_PROFILE,
      id,
      password,
      slug: id,
    };
    const updated = [...profiles, newProfile];
    if (saveProfiles(updated)) {
      setProfiles(updated);
    }
  };

  const deleteProfile = (e, id) => {
    e.stopPropagation();
    if (confirm(t("confirmDelete"))) {
      const updated = profiles.filter((p) => p.id !== id);
      if (saveProfiles(updated)) {
        setProfiles(updated);
      }
    }
  };

  const showCredentials = (e, profile) => {
    e.stopPropagation();
    setSelectedCredentialProfile(profile);
  };

  const regenerateProfilePassword = (profileId) => {
    const newPassword = Math.random().toString(36).slice(-8);
    const updatedProfiles = profiles.map((p) =>
      p.id === profileId ? { ...p, password: newPassword } : p
    );
    if (saveProfiles(updatedProfiles)) {
      setProfiles(updatedProfiles);
      if (
        selectedCredentialProfile &&
        selectedCredentialProfile.id === profileId
      ) {
        setSelectedCredentialProfile({
          ...selectedCredentialProfile,
          password: newPassword,
        });
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // if (session?.role === "client") return null;

  return (
    <AppleBackground>
      <div dir={isRTL ? "rtl" : "ltr"}>
        {/* Navigation */}
        <nav className="bg-white/70 backdrop-blur-xl border-b border-white/50 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <CreditCard size={20} fill="currentColor" />
            </div>
            Tapcard
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={createNewProfile}
              className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Plus size={18} /> {t("newCardBtn")}
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-full transition-colors"
            >
              <LogOut size={20} className={isRTL ? "rotate-180" : ""} />
            </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-8 py-12">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-8 border border-white/50 shadow-sm flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="text-gray-500 font-semibold">
                  {t("dashboardTitle")}
                </span>
                <div className="p-2 bg-blue-100/50 text-blue-600 rounded-xl">
                  <Users size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-900">
                  {profiles.length}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {t("totalClients")}
                </p>
              </div>
            </div>
            {/* Decorative Widgets */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 shadow-lg text-white flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="text-white/80 font-semibold">
                  {t("activeProfiles")}
                </span>
                <LayoutGrid size={20} className="text-white/80" />
              </div>
              <h3 className="text-4xl font-bold">{profiles.length}</h3>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-8 px-2">
            {t("clientCards")}
          </h2>

          {profiles.length === 0 ? (
            <div className="text-center py-24 bg-white/40 backdrop-blur-sm rounded-[2.5rem] border border-dashed border-gray-300/50">
              <div className="w-20 h-20 bg-white shadow-lg rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-gray-400">
                <CreditCard size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t("noCards")}
              </h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                {t("noCardsDesc")}
              </p>
              <button
                onClick={createNewProfile}
                className="text-blue-600 font-semibold hover:underline"
              >
                {t("createBtn")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-white/80 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
                  onClick={() => navigate(`/edit/${profile.id}`)}
                >
                  <div
                    className="h-28 w-full relative"
                    style={{ backgroundColor: profile.theme.primaryColor }}
                  >
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/view/${profile.id}`);
                        }}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-2 bg-white/20 backdrop-blur-md hover:bg-red-500/80 text-white rounded-full transition-colors"
                        onClick={(e) => deleteProfile(e, profile.id)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="px-6 pb-6 relative">
                    <div className="w-20 h-20 rounded-[1.2rem] border-4 border-white bg-gray-100 overflow-hidden shadow-md -mt-10 mb-4 mx-auto">
                      {profile.profilePicture ? (
                        <img
                          src={profile.profilePicture}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <CreditCard size={24} />
                        </div>
                      )}
                    </div>

                    <div className="text-center mb-6">
                      <h3 className="font-bold text-gray-900 truncate text-lg">
                        {profile.firstName || t("newProfileName")}{" "}
                        {profile.lastName || ""}
                      </h3>
                      <p className="text-sm text-gray-500 truncate font-medium">
                        {profile.profession || t("profession")}
                      </p>
                    </div>

                    <button
                      className="w-full py-3 px-4 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 group/btn"
                      onClick={(e) => showCredentials(e, profile)}
                    >
                      <Key
                        size={16}
                        className="text-gray-400 group-hover/btn:text-blue-600 transition-colors"
                      />
                      <span className="text-sm">Access ID</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Credentials Modal (Glass) */}
        {selectedCredentialProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <GlassCard className="w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/50">
                <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                  <Lock size={20} className="text-blue-600" /> {t("credTitle")}
                </h3>
                <button
                  onClick={() => setSelectedCredentialProfile(null)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  {t("credDesc")}
                </p>

                <div className="space-y-4">
                  <div className="group">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                      {t("loginId")}
                    </label>
                    <div className="flex gap-2 mt-1.5">
                      <div className="flex-1 bg-gray-50 border-0 px-4 py-3 rounded-2xl text-gray-800 font-mono text-base font-medium flex items-center">
                        {selectedCredentialProfile.id}
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(selectedCredentialProfile.id)
                        }
                        className="px-4 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 transition-colors"
                      >
                        <Copy size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="group">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                      {t("password")}
                    </label>
                    <div className="flex gap-2 mt-1.5">
                      <div className="flex-1 bg-gray-50 border-0 px-4 py-3 rounded-2xl text-gray-800 font-mono text-base font-medium flex items-center">
                        {selectedCredentialProfile.password}
                      </div>
                      <button
                        onClick={() =>
                          regenerateProfilePassword(
                            selectedCredentialProfile.id
                          )
                        }
                        className="px-4 bg-blue-50 hover:bg-blue-100 rounded-2xl text-blue-600 transition-colors"
                      >
                        <RefreshCw size={20} />
                      </button>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            selectedCredentialProfile.password || ""
                          )
                        }
                        className="px-4 bg-gray-100 hover:bg-gray-200 rounded-2xl text-gray-600 transition-colors"
                      >
                        <Copy size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCredentialProfile(null)}
                  className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  {t("doneBtn")}
                </button>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </AppleBackground>
  );
};

// --- Editor Component ---
const Editor = () => {
  const { id } = useParams();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const sess = getSession();
    if (!sess) {
      navigate("/");
      return;
    }
    setSession(sess);

    if (sess.role === "client" && sess.id !== id) {
      alert("Unauthorized access");
      navigate("/");
      return;
    }

    const profiles = getStoredProfiles();
    const found = profiles.find((p) => p.id === id);
    if (found) {
      setProfile(found);
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  }, [id, navigate]);

  const handleSave = (updatedProfile) => {
    if (id && id !== updatedProfile.id) {
      const profiles = getStoredProfiles();
      if (profiles.some((p) => p.id === updatedProfile.id)) {
        alert("This ID is already taken.");
        if (profile) setProfile({ ...profile });
        return;
      }
    }

    setProfile(updatedProfile);
    const profiles = getStoredProfiles();
    const newProfiles = profiles.map((p) => (p.id === id ? updatedProfile : p));

    if (saveProfiles(newProfiles)) {
      if (id && id !== updatedProfile.id) {
        navigate(`/edit/${updatedProfile.id}`, { replace: true });
      }
    }
  };

  const handleLogout = async () => {
    // If admin is editing (though currently logic separates them), sign out from firebase too
    if (session?.role === "admin") {
      try {
        await signOut(auth);
      } catch (e) {
        console.error(e);
      }
    }

    localStorage.removeItem(AUTH_KEY);
    // Redirect based on role
    navigate(session?.role === "admin" ? "/admindash" : "/");
  };

  if (loading || !profile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
        Loading...
      </div>
    );

  return (
    <div
      className="min-h-screen bg-[#F5F5F7] flex flex-col h-screen overflow-hidden font-sans"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 flex justify-between items-center z-50 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          {session?.role === "admin" ? (
            <Link
              to="/dashboard"
              className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
            >
              <ArrowLeft size={20} className={isRTL ? "rotate-180" : ""} />
            </Link>
          ) : (
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <CreditCard size={24} />
            </div>
          )}

          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              {session?.role === "client" ? t("myProfile") : t("editProfile")}
            </h1>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <LanguageSwitcher />
          <Link
            to={`/view/${profile.id}`}
            target="_blank"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50/50 hover:bg-blue-100 rounded-full transition-colors"
          >
            <Eye size={18} /> {t("liveView")}
          </Link>
          <button
            className="sm:hidden p-2.5 text-blue-600 bg-blue-50 rounded-full"
            onClick={() => setShowPreviewMobile(!showPreviewMobile)}
          >
            {showPreviewMobile ? t("edit") : t("preview")}
          </button>
          <button
            onClick={handleLogout}
            className="p-2.5 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full transition-colors ml-2"
          >
            <LogOut size={20} className={isRTL ? "rotate-180" : ""} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left: Editor Form */}
        <div
          className={`w-full lg:w-1/2 xl:w-2/5 overflow-y-auto bg-transparent p-6 ${
            showPreviewMobile ? "hidden" : "block"
          }`}
        >
          <div className="max-w-2xl mx-auto pb-10">
            <EditorForm profile={profile} onChange={handleSave} />
          </div>
        </div>

        {/* Right: Phone Preview */}
        <div
          className={`w-full lg:w-1/2 xl:w-3/5 bg-gray-100/50 backdrop-blur-3xl flex items-center justify-center p-8 transition-all duration-300 ${
            showPreviewMobile
              ? "block fixed inset-0 z-40 bg-gray-50 top-[73px]"
              : "hidden lg:flex"
          }`}
        >
          <div className="scale-[0.8] sm:scale-[0.9] lg:scale-100 transform transition-transform shadow-[0_30px_60px_-12px_rgba(50,50,93,0.25)] rounded-[2.5rem]">
            <PhonePreview profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- View Component (Public) ---
const ViewCard = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const profiles = getStoredProfiles();
    const found = profiles.find((p) => p.id === id);
    setProfile(found || null);
  }, [id]);

  if (!profile) {
    return (
      <AppleBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <GlassCard className="max-w-md p-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
              <AlertCircle size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {t("notFound")}
            </h1>
            <p className="text-gray-500 font-medium">{t("notFoundDesc")}</p>
            <Link
              to="/"
              className="mt-8 px-8 py-3 bg-gray-900 text-white font-bold rounded-full hover:bg-black transition-all"
            >
              {t("goToLogin")}
            </Link>
          </GlassCard>
        </div>
      </AppleBackground>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
      <PhonePreview profile={profile} />
    </div>
  );
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
