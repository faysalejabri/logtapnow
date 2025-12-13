export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
}

export type SocialPlatform = 
  | 'linkedin' 
  | 'twitter' 
  | 'instagram' 
  | 'facebook' 
  | 'youtube' 
  | 'github' 
  | 'website' 
  | 'email' 
  | 'whatsapp';

export interface VCardTheme {
  primaryColor: string;
  borderRadius: number; // in pixels
  backgroundColor: string; // Hex or generic name
}

export interface VCardProfile {
  id: string;
  password?: string; // For client login
  createdAt: number;
  slug: string; // for the unique URL
  profilePicture: string | null; // Base64 or URL
  firstName: string;
  lastName: string;
  profession: string;
  bio: string; // Manual
  email: string;
  phone: string;
  address: string; // For the map
  youtubeVideoUrl: string; // Embed URL
  socials: SocialLink[];
  theme: VCardTheme;
}