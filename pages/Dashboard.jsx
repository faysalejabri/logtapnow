import { AUTH_KEY, getSession, getStoredProfiles, saveProfiles } from "@/App";
import { AppleBackground } from "@/components/AppleBackground";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { signOut } from "firebase/auth";
import {
  CreditCard,
  X,
  Eye,
  LayoutGrid,
  LogOut,
  Plus,
  Users,
  Copy,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

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

export default Dashboard;
