import { SOCIAL_ICONS } from "../../../constants";
import { getYoutubeEmbedId, downloadVCard } from "../../utils/vcardHelpers";
import { User, MapPin, Download, Globe, Hexagon, Share2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import styles from "./PhonePreview.module.scss";

const PhonePreview = ({ profile }) => {
  const { theme } = profile;
  const { t } = useLanguage();
  const youtubeId = getYoutubeEmbedId(profile.youtubeVideoUrl);

  const buttonStyle = {
    backgroundColor: theme.primaryColor,
    borderRadius: `${theme.borderRadius}px`,
  };

  const iconButtonStyle = {
    borderRadius: `${theme.borderRadius}px`,
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/#/view/${profile.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.firstName} ${profile.lastName} - Tapcard`,
          text: `${t("shareText")} ${profile.firstName} ${profile.lastName}`,
          url: url,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert(t("shareSuccess"));
    }
  };

  return (
    <div className={styles["phone-preview"]}>
      {/* Phone Notch */}
      <div className={styles["phone-preview__notch"]}>
        <div className={styles["phone-preview__notch-inner"]}></div>
      </div>

      {/* Screen Content */}
      <div className={styles["phone-preview__screen"]}>
        {/* Share Button (Top Right) */}
        <button
          onClick={handleShare}
          className={styles["phone-preview__share-btn"]}
          title={t("shareTitle")}
        >
          <Share2 size={18} />
        </button>

        {/* Main Content Container */}
        <div className={styles["phone-preview__main"]}>
          {/* Brand Logo Placeholder */}
          <div className={styles["phone-preview__logo"]}>
            <Hexagon
              size={28}
              style={{ color: "#6b7280", fill: "currentColor" }}
            />
          </div>

          {/* New "Business Card" Style Header */}
          <div className={styles["phone-preview__card"]}>
            {/* Left: Image Section */}
            <div className={styles["phone-preview__card-img"]}>
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="Profile"
                  className={styles["phone-preview__card-img-el"]}
                />
              ) : (
                <div className={styles["phone-preview__card-img-placeholder"]}>
                  <User size={32} />
                </div>
              )}
            </div>
            {/* Right: Text Section */}
            <div className={styles["phone-preview__card-text"]}>
              <h2 className={styles["phone-preview__card-title"]}>
                <span>{profile.firstName || "First"}</span>
                <br />
                <span className={styles["phone-preview__card-title-last"]}>
                  {profile.lastName || "Name"}
                </span>
              </h2>
              <div
                className={styles["phone-preview__card-divider"]}
                style={{ backgroundColor: theme.primaryColor }}
              ></div>
              <p className={styles["phone-preview__card-profession"]}>
                {profile.profession || "PROFESSION"}
              </p>
            </div>
          </div>

          {/* Save Contact Button */}
          <div
            style={{
              gap: 12,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <button
              onClick={() => downloadVCard(profile)}
              className={styles["phone-preview__save-btn"]}
              style={buttonStyle}
            >
              <Download size={18} />
              {/* <span>{t("saveContact")}</span> */}
              <span>Save</span>
            </button>
            <button
              onClick={() => downloadVCard(profile)}
              className={styles["phone-preview__save-btn"]}
              style={buttonStyle}
            >
              <Download size={18} />
              <span>Send form</span>
            </button>
          </div>

          {/* Bio Section */}
          {profile.bio && (
            <div className={styles["phone-preview__bio"]}>
              <h3 className={styles["phone-preview__bio-title"]}>
                {t("about")}
              </h3>
              <p className={styles["phone-preview__bio-text"]}>{profile.bio}</p>
            </div>
          )}

          {/* Social Icons */}
          {profile?.socials.length > 0 && (
            <div className={styles["phone-preview__socials"]}>
              {profile.socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles["phone-preview__social-link"]}
                  style={iconButtonStyle}
                >
                  <i
                    className={`fi fi-brands-${social.platform}`}
                    style={{ fontSize: 20 }}
                  />
                </a>
              ))}
            </div>
          )}

          {/* Contact Details List */}
          <div className={styles["phone-preview__contacts"]}>
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className={styles["phone-preview__contact-link"]}
              >
                <div
                  className={
                    styles["phone-preview__contact-icon"] +
                    " " +
                    styles["phone-preview__contact-icon--email"]
                  }
                >
                  <SOCIAL_ICONS.email size={16} />
                </div>
                <span className={styles["phone-preview__contact-text"]}>
                  {profile.email}
                </span>
              </a>
            )}
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className={styles["phone-preview__contact-link"]}
              >
                <div
                  className={
                    styles["phone-preview__contact-icon"] +
                    " " +
                    styles["phone-preview__contact-icon--phone"]
                  }
                >
                  <SOCIAL_ICONS.whatsapp size={16} />
                </div>
                <span className={styles["phone-preview__contact-text"]}>
                  {profile.phone}
                </span>
              </a>
            )}
          </div>

          {/* YouTube Video */}
          {youtubeId && (
            <div className={styles["phone-preview__youtube"]}>
              <div className={styles["phone-preview__youtube-inner"]}>
                <iframe
                  className={styles["phone-preview__youtube-iframe"]}
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* Map */}
          {profile?.address && (
            <div className={styles["phone-preview__map"]}>
              <div className={styles["phone-preview__map-inner"]}>
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    profile.address
                  )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  className={styles["phone-preview__map-iframe"]}
                ></iframe>
              </div>
              <div className={styles["phone-preview__map-desc"]}>
                <MapPin
                  size={14}
                  style={{ marginTop: 2, color: "#ef4444", flexShrink: 0 }}
                />
                <p className={styles["phone-preview__map-text"]}>
                  {profile.address}
                </p>
              </div>
            </div>
          )}

          {/* Footer Branding */}
          <div className={styles["phone-preview__footer"]}>
            {t("poweredBy")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhonePreview;
