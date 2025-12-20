import { useLanguage } from "../../contexts/LanguageContext";
import { Globe } from "lucide-react";
import styles from "./LanguageSwitcher.module.scss";

const LanguageSwitcher = ({ className = "" }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`${styles["lang-switcher"]} ${className}`}>
      <Globe size={14} className={styles["lang-switcher__icon"]} />
      {["en", "fr", "ar"].map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`${styles["lang-switcher__btn"]} ${
            language === lang
              ? styles["lang-switcher__btn--active"]
              : styles["lang-switcher__btn--inactive"]
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
