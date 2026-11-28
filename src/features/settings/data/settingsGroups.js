import {
  User,
  Key,
  ShieldCheck,
  Palette,
  Pointer,
  Bell,
  Image as ImageIcon,
  HelpCircle,
  Flag,
  FileText,
  Info,
} from 'lucide-react-native';
import Constants from 'expo-constants';

export const APP_VERSION = Constants.expoConfig?.version || '1.0.0';

export const THEME_MODE_LABEL = { light: 'Light', dark: 'Dark', system: 'System Default' };

export const SETTINGS_GROUPS = [
  {
    title: 'Account & Security',
    rows: [
      {
        id: 'editProfile',
        label: 'Edit Profile',
        sub: 'Photo, name, username, bio, website',
        icon: User,
        type: 'nav',
      },
      {
        id: 'password',
        label: 'Password & Security',
        sub: 'Change your password',
        icon: Key,
        type: 'nav',
      },
      {
        id: 'twofa',
        label: 'Two-Factor Authentication',
        sub: 'Coming soon',
        icon: ShieldCheck,
        type: 'nav',
      },
    ],
  },
  {
    title: 'Appearance',
    rows: [{ id: 'theme', label: 'App Theme', sub: 'System Default', icon: Palette, type: 'nav' }],
  },
  {
    title: 'Screen Recording',
    rows: [
      {
        id: 'showTouches',
        label: 'Show Touches',
        sub: 'Show a circle wherever you tap',
        icon: Pointer,
        type: 'toggle',
      },
    ],
  },
  {
    title: 'Notifications',
    rows: [
      {
        id: 'pushAll',
        label: 'Push Notifications',
        sub: 'Comments, likes, new followers, messages and bookings',
        icon: Bell,
        type: 'toggle',
      },
    ],
  },
  {
    title: 'Data & Media',
    rows: [
      {
        id: 'hqUploads',
        label: 'High-Quality Uploads',
        sub: 'Use more data for sharper tapes',
        icon: ImageIcon,
        type: 'toggle',
      },
    ],
  },
  {
    title: 'Help & About',
    rows: [
      { id: 'help', label: 'Help Center & Support', icon: HelpCircle, type: 'nav' },
      { id: 'report', label: 'Report a Problem', icon: Flag, type: 'nav' },
      { id: 'terms', label: 'Terms of Service & Privacy Policy', icon: FileText, type: 'nav' },
      {
        id: 'about',
        label: 'About TripTape',
        sub: `Version ${APP_VERSION}`,
        icon: Info,
        type: 'nav',
      },
    ],
  },
];
