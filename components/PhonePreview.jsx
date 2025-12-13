import React from "react";
import { SOCIAL_ICONS } from "../constants";
import { getYoutubeEmbedId, downloadVCard } from "../utils/vcardHelpers";
import { User, MapPin, Download, Globe, Hexagon, Share2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

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
    <div className="relative mx-auto border-gray-900 bg-gray-900 border-[14px] rounded-[2.5rem] h-[750px] w-[360px] shadow-2xl overflow-hidden flex flex-col">
      {/* Phone Notch */}
      <div className="h-[32px] w-full bg-gray-900 absolute top-0 left-0 right-0 z-20 flex justify-center">
        <div className="h-[18px] w-[120px] bg-black rounded-b-[1rem]"></div>
      </div>
      <div className="flex-1 bg-gray-100 overflow-y-auto no-scrollbar relative">
        <button
          onClick={handleShare}
          className="absolute top-12 right-5 z-30 p-2.5 bg-white rounded-full text-gray-600 shadow-md hover:text-blue-600 hover:scale-110 transition-all"
          title={t("shareTitle")}
        >
          <Share2 size={18} />
        </button>
        {/* ...rest of the component... */}
      </div>
    </div>
  );
};

export default PhonePreview;
