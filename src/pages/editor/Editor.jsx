import EditorForm from "@/src/components/editor-form/EditorForm";
import LanguageSwitcher from "@/src/components/language-switcher/LanguageSwitcher";
import PhonePreview from "@/src/components/phone-preview/PhonePreview";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { ArrowLeft, CreditCard, LogOut } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import styles from "./Editor.module.scss";
import { isAdmin, logout } from "@/src/lib/auth";
import { ProfilesContext } from "@/src/contexts/ProfilesContext";

const Editor = () => {
  const location = useLocation();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const { profiles, setProfiles } = useContext(ProfilesContext);
  const [profile, setProfile] = useState(location.state);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  const handleSave = (updatedProfile) => {
    setProfile(updatedProfile);
    setProfiles((prevProfiles) =>
      prevProfiles.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    );
  };

  const isAnAdmin = isAdmin();

  const handleLogout = async () => {
    try {
      logout();
    } catch (e) {
      console.error("Error signing out from firebase", e);
    }
    // Redirect Admin to /admindash, Client to /
    navigate(isAnAdmin ? "/admindash" : "/");
  };

  return (
    <div className={styles.container} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          {isAnAdmin ? (
            <Link to="/dashboard" className={styles.backButton}>
              <ArrowLeft size={20} className={isRTL ? "rotate-180" : ""} />
            </Link>
          ) : (
            <div className={styles.creditCard}>
              <CreditCard size={24} />
            </div>
          )}

          <div>
            <h1 className={styles.title}>
              {!isAnAdmin ? t("myProfile") : t("editProfile")}
            </h1>
          </div>
        </div>

        <div className={styles.headerRight}>
          <LanguageSwitcher />

          <button
            className={styles.liveViewLink}
            onClick={() => setShowPreviewMobile(!showPreviewMobile)}
          >
            {showPreviewMobile ? t("edit") : t("preview")}
          </button>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogOut size={20} className={isRTL ? "rotate-180" : ""} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Editor */}
        <div
          className={`${styles.editorWrapper} ${
            showPreviewMobile ? styles.hiddenMobile : styles.block
          }`}
        >
          <div className="max-w-2xl mx-auto pb-10">
            <EditorForm profile={profile} onChange={handleSave} />
          </div>
        </div>

        {/* Phone Preview */}
        <div
          className={`${styles.phonePreviewWrapper} ${
            showPreviewMobile ? styles.mobileShow : styles.desktopHide
          }`}
          style={{ transform: "scale(0.8)" }}
        >
          <div className={styles.phoneContainer}>
            <PhonePreview profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
