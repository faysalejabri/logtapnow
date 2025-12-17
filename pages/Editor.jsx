import { AUTH_KEY, getSession, getStoredProfiles, saveProfiles } from "@/App";
import EditorForm from "@/components/EditorForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import PhonePreview from "@/components/PhonePreview";
import { useLanguage } from "@/contexts/LanguageContext";
import { signOut } from "firebase/auth";
import { ArrowLeft, CreditCard, Eye, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

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

export default Editor;
