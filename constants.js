export const DEFAULT_THEME = {
  primaryColor: "#2563eb",
  borderRadius: 12,
  backgroundColor: "#ffffff",
};

export const DEFAULT_PROFILE = {
  id: "",
  password: "",
  createdAt: Date.now(),
  slug: "",
  profilePicture: null,
  firstName: "",
  lastName: "",
  profession: "",
  bio: "",
  email: "",
  phone: "",
  address: "",
  youtubeVideoUrl: "",
  socials: [],
  theme: DEFAULT_THEME,
};

export const SOCIAL_ICONS = {
  linkedin: "Linkedin",
  twitter: "Twitter",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "Youtube",
  github: "Github",
  website: "Globe",
  email: "Mail",
  whatsapp: "Phone",
};

export const SOCIAL_LABELS = {
  linkedin: "LinkedIn",
  twitter: "X (Twitter)",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube Channel",
  github: "GitHub",
  website: "Website",
  email: "Email",
  whatsapp: "WhatsApp",
};
