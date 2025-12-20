import { SOCIAL_ICONS } from "../../constants";
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

      {/* Screen Content */}
      <div className="flex-1 bg-gray-100 overflow-y-auto no-scrollbar relative">
        {/* Share Button (Top Right) */}
        <button
          onClick={handleShare}
          className="absolute top-12 right-5 z-30 p-2.5 bg-white rounded-full text-gray-600 shadow-md hover:text-blue-600 hover:scale-110 transition-all"
          title={t("shareTitle")}
        >
          <Share2 size={18} />
        </button>

        {/* Main Content Container */}
        <div className="pt-14 px-4 pb-12 flex flex-col items-center relative z-10">
          {/* Brand Logo Placeholder */}
          <div className="mb-6 opacity-30 flex flex-col items-center justify-center gap-1">
            <Hexagon size={28} className="fill-current text-gray-500" />
          </div>

          {/* New "Business Card" Style Header */}
          <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-row h-48 mb-6 transform transition-all hover:scale-[1.01] duration-300">
            {/* Left: Image Section */}
            <div className="w-[45%] relative bg-gray-200 h-full">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="Profile"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200">
                  <User size={32} />
                </div>
              )}
            </div>

            {/* Right: Text Section */}
            <div className="w-[55%] p-4 flex flex-col justify-center text-left bg-white relative">
              <h2 className="text-xl font-black text-gray-900 leading-tight mb-2">
                <span className="block">{profile.firstName || "First"}</span>
                <span className="block text-gray-600">
                  {profile.lastName || "Name"}
                </span>
              </h2>

              <div
                className="h-1 w-8 mb-3 rounded-full"
                style={{ backgroundColor: theme.primaryColor }}
              ></div>

              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed line-clamp-3">
                {profile.profession || "PROFESSION"}
              </p>
            </div>
          </div>

          {/* Save Contact Button */}
          <button
            onClick={() => downloadVCard(profile)}
            className="w-full py-3 px-4 text-white font-semibold shadow-md flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95"
            style={buttonStyle}
          >
            <Download size={18} />
            <span>{t("saveContact")}</span>
          </button>

          {/* Bio Section */}
          {profile.bio && (
            <div className="mt-6 w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {t("about")}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Social Icons */}
          {profile?.socials.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-3 w-full">
              {profile.socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.platform] || Globe;
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white text-gray-700 hover:text-white hover:bg-gray-800 transition-all shadow-sm border border-gray-100 hover:border-gray-800 hover:-translate-y-1"
                    style={iconButtonStyle}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          )}

          {/* Contact Details List */}
          <div className="mt-6 w-full space-y-3">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <SOCIAL_ICONS.email size={16} />
                </div>
                <span className="text-sm text-gray-700 font-medium break-all">
                  {profile.email}
                </span>
              </a>
            )}
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-green-50 text-green-600">
                  <SOCIAL_ICONS.whatsapp size={16} />
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {profile.phone}
                </span>
              </a>
            )}
          </div>

          {/* YouTube Video */}
          {youtubeId && (
            <div className="mt-6 w-full">
              <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden shadow-lg bg-black">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
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
            <div className="mt-6 w-full bg-white p-1 rounded-xl shadow-sm border border-gray-100">
              <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-200 relative">
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
                  className="opacity-90 hover:opacity-100 transition-opacity"
                ></iframe>
              </div>
              <div className="p-3 flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 text-red-500 shrink-0" />
                <p className="text-xs text-gray-600 font-medium">
                  {profile.address}
                </p>
              </div>
            </div>
          )}

          {/* Footer Branding */}
          <div className="mt-8 mb-2 text-[10px] text-gray-400 font-medium uppercase tracking-widest">
            {t("poweredBy")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhonePreview;
