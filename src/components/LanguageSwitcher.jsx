import { useLanguage } from "../contexts/LanguageContext";
import { Globe } from "lucide-react";

const LanguageSwitcher = ({ className = "" }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`flex items-center gap-1 bg-white/10 backdrop-blur-sm p-1 rounded-lg border border-white/20 ${className}`}
    >
      <Globe
        size={14}
        className={
          language === "ar" ? "ml-1 text-gray-500" : "mr-1 text-gray-500"
        }
      />
      {["en", "fr", "ar"].map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`
            px-2 py-0.5 text-xs font-bold rounded transition-colors uppercase
            ${
              language === lang
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }
          `}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
