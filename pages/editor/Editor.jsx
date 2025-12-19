import { AUTH_KEY } from "@/App";
import EditorForm from "@/components/EditorForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import PhonePreview from "@/components/PhonePreview";
import { useLanguage } from "@/contexts/LanguageContext";
import { session } from "@/data/data";
import { signOut } from "firebase/auth";
import { ArrowLeft, CreditCard, Eye, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import styles from "./Editor.module.scss";

const Editor = () => {
  const location = useLocation();
  const { t, isRTL } = useLanguage();
  const [profile, setProfile] = useState(location.state);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  const handleSave = (updatedProfile) => setProfile(updatedProfile);

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

  return (
    <div className={styles.container} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          {session?.role === "admin" ? (
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
              {session?.role === "client" ? t("myProfile") : t("editProfile")}
            </h1>
          </div>
        </div>

        <div className={styles.headerRight}>
          <LanguageSwitcher />
          <Link to={`/view/${profile.id}`} className={styles.liveViewLink}>
            <Eye size={18} /> {t("liveView")}
          </Link>
          <button
            className={styles.previewButton}
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
