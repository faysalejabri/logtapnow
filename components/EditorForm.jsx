import { useState, useEffect } from "react";
import { SOCIAL_LABELS } from "../constants";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Trash2,
  Plus,
  Upload,
  MapPin,
  Palette,
  Type,
  Globe,
  Video,
  Lock,
  Copy,
  RefreshCw,
  AlertTriangle,
  Video as VideoIcon,
} from "lucide-react";
import Button from "./Button";

const EditorForm = ({ profile, onChange }) => {
  const { t, isRTL } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [imageError, setImageError] = useState(null);

  // Local state for ID editing to prevent re-render loop on keystroke
  const [localId, setLocalId] = useState(profile.id);

  // Sync localId if profile.id changes externally (e.g. after save or nav)
  useEffect(() => {
    setLocalId(profile.id);
  }, [profile.id]);

  const updateField = (field, value) => {
    onChange({ ...profile, [field]: value });
  };

  const updateTheme = (field, value) => {
    onChange({ ...profile, theme: { ...profile.theme, [field]: value } });
  };

  // Helper to resize image
  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 500; // Limit width to 500px to save space
          const scaleSize = MAX_WIDTH / img.width;

          // Only resize if image is larger than max width
          if (scaleSize < 1) {
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;
          } else {
            canvas.width = img.width;
            canvas.height = img.height;
          }

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Compress to JPEG with 0.7 quality
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    setImageError(null);
    if (file) {
      try {
        if (file.size > 5 * 1024 * 1024) {
          setImageError(
            "Image is too large (max 5MB original). It will be compressed."
          );
        }
        const compressedImage = await resizeImage(file);
        updateField("profilePicture", compressedImage);
      } catch (err) {
        setImageError("Failed to process image. Please try a different file.");
        console.error(err);
      }
    }
  };

  const addSocial = () => {
    const newSocial = {
      id: Math.random().toString(36).substr(2, 9),
      platform: "website",
      url: "",
    };
    updateField("socials", [...profile.socials, newSocial]);
  };

  const updateSocial = (id, field, value) => {
    const updatedSocials = profile.socials.map((s) =>
      s.id === id ? { ...s, [field]: value } : s
    );
    updateField("socials", updatedSocials);
  };

  const removeSocial = (id) => {
    updateField(
      "socials",
      profile.socials.filter((s) => s.id !== id)
    );
  };

  const regeneratePassword = () => {
    const newPass = Math.random().toString(36).slice(-8);
    updateField("password", newPass);
  };

  const handleIdChange = (e) => {
    // Only allow alphanumeric, hyphens, and underscores for URL safety
    const val = e.target.value.replace(/[^a-zA-Z0-9-_]/g, "");
    setLocalId(val);
  };

  const commitIdChange = () => {
    if (localId !== profile.id) {
      if (localId.trim() === "") {
        setLocalId(profile.id); // Revert if empty
        return;
      }
      updateField("id", localId);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Simple alert for feedback
    const el = document.createElement("div");
    el.innerText = "Copied to clipboard";
    el.style.position = "fixed";
    el.style.bottom = "20px";
    el.style.right = "20px";
    el.style.background = "#333";
    el.style.color = "#fff";
    el.style.padding = "10px 20px";
    el.style.borderRadius = "5px";
    el.style.zIndex = "1000";
    document.body.appendChild(el);
    setTimeout(() => document.body.removeChild(el), 2000);
  };

  return (
    <div className="space-y-8 pb-12" dir={isRTL ? "rtl" : "ltr"}>
      {/* 1. Profile Information */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Type size={18} className="text-blue-500" /> {t("basicInfo")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2 flex flex-col gap-2 mb-2">
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 shrink-0">
                {profile.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Upload className="text-gray-400" size={24} />
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("profilePic")}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {t("picRecommend")}
                </p>
              </div>
            </div>
            {imageError && (
              <div className="text-xs text-amber-600 flex items-center gap-1 bg-amber-50 p-2 rounded">
                <AlertTriangle size={12} /> {imageError}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("firstName")}
            </label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("lastName")}
            </label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Doe"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("profession")}
            </label>
            <input
              type="text"
              value={profile.profession}
              onChange={(e) => updateField("profession", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Software Engineer"
            />
          </div>
          <div className="col-span-2">
            <div className="flex justify-between items-end mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("bio")}
              </label>
            </div>
            <textarea
              value={profile.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24"
              placeholder="..."
            />
          </div>
        </div>
      </section>

      {/* 2. Contact & Location */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-red-500" /> {t("locContact")}
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("email")}
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("phone")}
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("address")}
            </label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => updateField("address", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="123 Innovation Dr, Tech City, CA"
            />
            <p className="text-xs text-gray-500 mt-1">{t("addressHint")}</p>
          </div>
        </div>
      </section>

      {/* 3. Multimedia */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <VideoIcon size={18} className="text-pink-500" /> {t("multimedia")}
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("youtubeUrl")}
          </label>
          <input
            type="url"
            value={profile.youtubeVideoUrl}
            onChange={(e) => updateField("youtubeVideoUrl", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>
      </section>

      {/* 4. Social Links */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Globe size={18} className="text-green-500" /> {t("socialMedia")}
          </h3>
          <Button onClick={addSocial} variant="outline" size="sm" type="button">
            <Plus size={16} /> {t("addSocial")}
          </Button>
        </div>

        <div className="space-y-3">
          {profile.socials.map((social) => (
            <div key={social.id} className="flex gap-2 items-start">
              <div className="w-1/3">
                <select
                  value={social.platform}
                  onChange={(e) =>
                    updateSocial(social.id, "platform", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {Object.keys(SOCIAL_LABELS).map((key) => (
                    <option key={key} value={key}>
                      {SOCIAL_LABELS[key]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={social.url}
                  onChange={(e) =>
                    updateSocial(social.id, "url", e.target.value)
                  }
                  placeholder="URL..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <button
                onClick={() => removeSocial(social.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {profile.socials.length === 0 && (
            <p className="text-sm text-gray-400 italic text-center py-4">
              {t("noSocials")}
            </p>
          )}
        </div>
      </section>

      {/* 5. Appearance */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Palette size={18} className="text-indigo-500" /> {t("appearance")}
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("primaryColor")}
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={profile.theme.primaryColor}
                onChange={(e) => updateTheme("primaryColor", e.target.value)}
                className="h-10 w-20 rounded cursor-pointer border-0 p-0"
              />
              <div className="flex-1 flex gap-2 overflow-x-auto pb-2">
                {/* Preset Colors */}
                {[
                  "#2563eb",
                  "#dc2626",
                  "#16a34a",
                  "#d946ef",
                  "#ea580c",
                  "#000000",
                ].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => updateTheme("primaryColor", c)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      profile.theme.primaryColor === c
                        ? "border-gray-900"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                {t("btnRoundness")}
              </label>
              <span className="text-xs text-gray-500">
                {profile.theme.borderRadius}px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={profile.theme.borderRadius}
              onChange={(e) =>
                updateTheme("borderRadius", parseInt(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{t("square")}</span>
              <span>{t("rounded")}</span>
              <span>{t("pill")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Account Settings (Credentials) */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-orange-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Lock size={18} className="text-orange-500" /> {t("accountSettings")}
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
            <div className="mb-3">
              <label className="block text-sm font-bold text-gray-700 mb-1">
                {t("loginId")}:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={localId}
                  onChange={handleIdChange}
                  onBlur={commitIdChange}
                  onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded bg-white font-mono focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
                <button
                  onClick={() => copyToClipboard(profile.id)}
                  className="text-orange-600 hover:text-orange-800 p-2 bg-white rounded border border-gray-200 hover:bg-orange-50"
                >
                  <Copy size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Unique ID used for login URL (letters, numbers, dashes,
                underscores). Click outside to save.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-700">
                {t("password")}:
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={profile.password || ""}
                onChange={(e) => updateField("password", e.target.value)}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded bg-white font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <VideoIcon size={16} /> : <Type size={16} />}
              </button>
              <button
                type="button"
                onClick={regeneratePassword}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                title={t("regenerateTitle")}
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500">{t("shareCreds")}</p>
        </div>
      </section>
    </div>
  );
};

export default EditorForm;
