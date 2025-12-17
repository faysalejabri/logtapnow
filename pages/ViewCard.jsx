import { getStoredProfiles } from "@/App";
import { AppleBackground } from "@/components/AppleBackground";
import { GlassCard } from "@/components/GlassCard";
import PhonePreview from "@/components/PhonePreview";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";

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

export default ViewCard;
