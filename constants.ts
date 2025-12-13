import { VCardProfile, SocialPlatform } from './types';
import { 
  Linkedin, 
  Twitter, 
  Instagram, 
  Facebook, 
  Youtube, 
  Github, 
  Globe, 
  Mail,
  Phone
} from 'lucide-react';

export const DEFAULT_THEME = {
  primaryColor: '#2563eb',
  borderRadius: 12,
  backgroundColor: '#ffffff'
};

export const DEFAULT_PROFILE: VCardProfile = {
  id: '',
  password: '', // Will be generated on creation
  createdAt: Date.now(),
  slug: '',
  profilePicture: null,
  firstName: '',
  lastName: '',
  profession: '',
  bio: '',
  email: '',
  phone: '',
  address: '',
  youtubeVideoUrl: '',
  socials: [],
  theme: DEFAULT_THEME
};

export const SOCIAL_ICONS: Record<SocialPlatform, any> = {
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  github: Github,
  website: Globe,
  email: Mail,
  whatsapp: Phone
};

export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  linkedin: 'LinkedIn',
  twitter: 'X (Twitter)',
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube Channel',
  github: 'GitHub',
  website: 'Website',
  email: 'Email',
  whatsapp: 'WhatsApp'
};