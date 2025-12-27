import { AppleBackground } from "@/src/components/apple-background/AppleBackground";
import LanguageSwitcher from "@/src/components/language-switcher/LanguageSwitcher";
import { useLanguage } from "@/src/contexts/LanguageContext";
import { DEFAULT_PROFILE, PROFILES } from "@/src/data/data";
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
  Key,
  Lock,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./Dashboard.module.scss";
import { GlassCard } from "@/src/components/glass-card/GlassCard";
import GlassTable from "@/src/components/glass-table/GlassTable";
import { logout } from "@/src/lib/auth";

const Dashboard = () => {
  const { t, isRTL } = useLanguage();
  const [profiles, setProfiles] = useState(PROFILES);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCredentialProfile, setSelectedCredentialProfile] =
    useState(null);
  const navigate = useNavigate();

  const activeProfiles = profiles.filter((p) => p.active);
  const inactiveProfiles = profiles.filter((p) => !p.active);

  const handleLogout = async () => {
    try {
      logout();
    } catch (e) {
      console.error("Error signing out from firebase", e);
    }
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
    setProfiles(updated);
  };

  const deleteProfile = (e, id) => {
    e.stopPropagation();
    if (confirm(t("confirmDelete"))) {
      const updated = profiles.filter((p) => p.id !== id);
      // if (saveProfiles(updated)) {
      setProfiles(updated);
      // }
    }
  };

  const showCredentials = (e, profile) => {
    try {
      e.stopPropagation();
      setSelectedCredentialProfile(profile);
    } catch (error) {
      console.error("❌ Error showing credentials:", error);
    }
  };

  const regenerateProfilePassword = (profileId) => {
    const newPassword = Math.random().toString(36).slice(-8);
    const updatedProfiles = profiles.map((p) =>
      p.id === profileId ? { ...p, password: newPassword } : p
    );
    // if (saveProfiles(updatedProfiles)) {
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
    // }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <AppleBackground>
      <div className={styles.wrapper} dir={isRTL ? "rtl" : "ltr"}>
        {/* Navigation */}
        <nav className={styles.navbar}>
          <div className={styles.navbar__brand}>
            <div className={styles.navbar__logo}>
              <CreditCard size={20} />
            </div>
            Tapcard
          </div>

          <div className={styles.navbar__actions}>
            <LanguageSwitcher />

            <button
              className={`${styles.btn} ${styles.__primary}`}
              onClick={createNewProfile}
            >
              <Plus size={18} />
              {t("newCardBtn")}
            </button>

            <button
              className={`${styles.btn} ${styles.__icon}`}
              onClick={handleLogout}
            >
              <LogOut size={20} className={isRTL ? "rtl" : ""} />
            </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-8 py-12">
          {/* Stats Section */}
          <div className={styles.grid}>
            {/* Total Clients */}
            <div className={`${styles.cardBase} ${styles.glassCard}`}>
              <div className={styles.cardHeader}>
                <span className={styles.cardLabel}>{t("dashboardTitle")}</span>
                <div className={styles.iconWrapper}>
                  <Users size={20} />
                </div>
              </div>

              <div>
                <h3 className={styles.value}>{profiles.length}</h3>
                <p className={styles.subText}>{t("totalClients")}</p>
              </div>
            </div>

            {/* Active Profiles */}
            <div className={`${styles.cardBase} ${styles.gradientCard}`}>
              <div className={styles.cardHeader}>
                <span className={styles.cardLabelLight}>
                  {t("activeProfiles")}
                </span>
                <LayoutGrid size={20} className={styles.iconLight} />
              </div>

              <h3 className={styles.valueLight}>{activeProfiles.length}</h3>
            </div>

            {/* Inactive Profiles */}
            <div className={`${styles.cardBase} ${styles.glassCard}`}>
              <div className={styles.cardHeader}>
                <span className={styles.cardLabel}>
                  {t("inactiveProfiles")}
                </span>
                <LayoutGrid size={20} className={styles.iconLight} />
              </div>

              <h3 className={styles.value}>{inactiveProfiles.length}</h3>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8 px-2">
              {t("clientCards")}
            </h2>

            <div className={styles.viewToggle}>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={viewMode === "table"}
                  onChange={(e) =>
                    setViewMode(e.target.checked ? "table" : "grid")
                  }
                />
                <span className={styles.slider} />
              </label>

              <span className={styles.label}>
                {viewMode === "grid" ? "Grid" : "Table"}
              </span>
            </div>
          </div>

          {profiles.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <CreditCard size={36} />
              </div>

              <h3 className={styles.emptyTitle}>{t("noCards")}</h3>

              <p className={styles.emptyText}>{t("noCardsDesc")}</p>

              <button onClick={createNewProfile} className={styles.emptyButton}>
                {t("createBtn")}
              </button>
            </div>
          ) : viewMode === "table" ? (
            <GlassTable
              profiles={profiles}
              deleteProfile={deleteProfile}
              showCredentials={showCredentials}
            />
          ) : (
            <div className={styles.grid2}>
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className={styles.card}
                  onClick={() => {
                    console.log(profile);
                    navigate(`/edit/${profile.id}`, { state: profile });
                  }}
                >
                  <div
                    className={styles.cardHeader}
                    style={{ backgroundColor: profile.theme.primaryColor }}
                  >
                    <div className={styles.cardActions}>
                      <button
                        className={styles.actionButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/view/${profile.id}`);
                        }}
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                        onClick={(e) => deleteProfile(e, profile.id)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.avatar}>
                      {profile.profilePicture ? (
                        <img src={profile.profilePicture} alt="" />
                      ) : (
                        <CreditCard size={24} />
                      )}
                    </div>

                    <h3 className={styles.name}>
                      {profile.firstName || t("newProfileName")}{" "}
                      {profile.lastName || ""}
                    </h3>

                    <p className={styles.profession}>
                      {profile.profession || t("profession")}
                    </p>

                    <button
                      className={styles.accessButton}
                      onClick={(e) => showCredentials(e, profile)}
                    >
                      <Key size={16} className={styles.accessIcon} />
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
          <div className={styles.credentialOverlay}>
            <GlassCard className={styles.credentialModal}>
              {/* Header */}
              <div className={styles.credentialHeader}>
                <h3 className={styles.credentialTitle}>
                  <Lock size={20} className={styles.credentialTitleIcon} />
                  {t("credTitle")}
                </h3>

                <button
                  onClick={() => setSelectedCredentialProfile(null)}
                  className={styles.credentialClose}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className={styles.credentialBody}>
                <p className={styles.credentialDescription}>{t("credDesc")}</p>

                {/* Login ID */}
                <div className={styles.credentialBlock}>
                  <label className={styles.credentialLabel}>
                    {t("loginId")}
                  </label>

                  <div className={styles.credentialRow}>
                    <div className={styles.credentialValue}>
                      {selectedCredentialProfile.id}
                    </div>

                    <button
                      onClick={() =>
                        copyToClipboard(selectedCredentialProfile.id)
                      }
                      className={`${styles.credentialIconButton} ${styles.credentialGrayButton}`}
                    >
                      <Copy size={20} />
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div className={styles.credentialBlock}>
                  <label className={styles.credentialLabel}>
                    {t("password")}
                  </label>

                  <div className={styles.credentialRow}>
                    <div className={styles.credentialValue}>
                      {selectedCredentialProfile.password}
                    </div>

                    <button
                      onClick={() =>
                        regenerateProfilePassword(selectedCredentialProfile.id)
                      }
                      className={`${styles.credentialIconButton} ${styles.credentialBlueButton}`}
                    >
                      <RefreshCw size={20} />
                    </button>

                    <button
                      onClick={() =>
                        copyToClipboard(
                          selectedCredentialProfile.password || ""
                        )
                      }
                      className={`${styles.credentialIconButton} ${styles.credentialGrayButton}`}
                    >
                      <Copy size={20} />
                    </button>
                  </div>
                </div>

                {/* Done */}
                <button
                  onClick={() => setSelectedCredentialProfile(null)}
                  className={styles.credentialDone}
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
