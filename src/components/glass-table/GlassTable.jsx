import { useNavigate } from "react-router";
import styles from "./GlassTable.module.scss";
import { CreditCard, Eye, Key, Pencil, X } from "lucide-react";
import { useLanguage } from "@/src/contexts/LanguageContext";

export default function GlassTable({
  profiles,
  showCredentials,
  deleteProfile,
}) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Theme</th>
            <th>Avatar</th>
            <th>Name</th>
            <th>Profession</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id}>
              {/* Theme Dot */}
              <td data-label="Theme" style={{ width: 20 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 60,
                    backgroundColor: profile.theme?.primaryColor || "#2563eb",
                  }}
                />
              </td>

              {/* Avatar */}
              <td data-label="Avatar">
                <div className={styles.tableAvatar}>
                  {profile.profilePicture ? (
                    <img src={profile.profilePicture} alt="" />
                  ) : (
                    <CreditCard size={20} />
                  )}
                </div>
              </td>

              {/* Name */}
              <td data-label="Name">
                <div className={styles.tableName}>
                  {profile.firstName || t("newProfileName")}{" "}
                  {profile.lastName || ""}
                </div>
              </td>

              {/* Profession */}
              <td data-label="Profession">
                <div className={styles.tableSubText}>
                  {profile.profession || t("profession")}
                </div>
              </td>

              {/* Active Status */}
              <td data-label="Active" style={{ width: 20 }}>
                <div
                  style={{
                    fontSize: 12,
                    borderRadius: 8,
                    padding: "2px 6px",
                    textAlign: "center",
                    color: profile.active ? "#16a34a" : "#ef4444",
                    backgroundColor: profile.active ? "#16a34a3d" : "#ef44443d",
                    border: `1px solid ${
                      profile.active ? "#16a34a" : "#ef4444"
                    }`,
                  }}
                >
                  {profile.active ? "Active" : "Inactive"}
                </div>
              </td>

              {/* Actions */}
              <td data-label="Actions">
                <div className={styles.tableActions}>
                  <button
                    className={styles.tableActionBtn}
                    onClick={() =>
                      navigate(`/edit/${profile.id}`, { state: profile })
                    }
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className={styles.tableActionBtn}
                    onClick={() => navigate(`/view/${profile.id}`)}
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    className={styles.tableActionBtn}
                    onClick={(e) => showCredentials(e, profile)}
                  >
                    <Key size={16} />
                  </button>

                  <button
                    className={`${styles.tableActionBtn} ${styles.tableActionDanger}`}
                    onClick={(e) => deleteProfile(e, profile.id)}
                  >
                    <X size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
