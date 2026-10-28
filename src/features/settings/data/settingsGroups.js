import {
  User,
  Lock,
  Key,
  ShieldCheck,
  Bookmark,
  Link as LinkIcon,
  Eye,
  UserX,
  Palette,
  Pointer,
  Bell,
  MessageCircle,
  Heart,
  Send,
  UserPlus,
  Mail,
  Image as ImageIcon,
  Database,
  HelpCircle,
  Flag,
  FileText,
  Info,
} from 'lucide-react-native';

export const THEME_MODE_LABEL = { light: 'Light', dark: 'Dark', system: 'System Default' };

export const SETTINGS_GROUPS = [
  {
    title: 'Account & Security',
    rows: [
      {
        id: 'editProfile',
        label: 'Edit Profile',
        sub: 'Name, username, bio, website, avatar',
        icon: User,
        type: 'nav',
      },
      {
        id: 'privacy',
        label: 'Private Account',
        sub: 'Only approved followers can see your trips',
        icon: Lock,
        type: 'toggle',
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
        sub: 'Add an extra layer of security',
        icon: ShieldCheck,
        type: 'nav',
      },
      {
        id: 'saved',
        label: 'Saved & Bookmarks',
        sub: 'Trips and reels you’ve saved',
        icon: Bookmark,
        type: 'nav',
      },
      {
        id: 'linked',
        label: 'Linked Accounts',
        sub: 'Manage connected social logins',
        icon: LinkIcon,
        type: 'nav',
      },
    ],
  },
  {
    title: 'Content & Experience',
    rows: [
      {
        id: 'sensitive',
        label: 'Sensitive Content Control',
        sub: 'Filter graphic or mature content',
        icon: Eye,
        type: 'nav',
      },
      {
        id: 'blocked',
        label: 'Blocked & Muted Accounts',
        sub: 'Manage accounts you’ve restricted',
        icon: UserX,
        type: 'nav',
      },
      { id: 'theme', label: 'App Theme', sub: 'System Default', icon: Palette, type: 'nav' },
    ],
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
        sub: 'Pause all mobile alerts',
        icon: Bell,
        type: 'toggle',
      },
      {
        id: 'notifComments',
        label: 'Comments',
        sub: 'When someone comments on your reel',
        icon: MessageCircle,
        type: 'toggle',
      },
      {
        id: 'notifLikes',
        label: 'Likes',
        sub: 'When someone likes your reel',
        icon: Heart,
        type: 'toggle',
      },
      {
        id: 'notifDMs',
        label: 'Direct Messages',
        sub: 'New messages from other travellers',
        icon: Send,
        type: 'toggle',
      },
      {
        id: 'notifFollowers',
        label: 'New Followers',
        sub: 'When someone follows you',
        icon: UserPlus,
        type: 'toggle',
      },
      {
        id: 'emailSms',
        label: 'Email & SMS Notifications',
        sub: 'Booking updates and receipts',
        icon: Mail,
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
        sub: 'Use more data for sharper reels',
        icon: ImageIcon,
        type: 'toggle',
      },
      {
        id: 'dataSaver',
        label: 'Data Saver Mode',
        sub: 'Reduce data usage across the app',
        icon: Database,
        type: 'toggle',
      },
    ],
  },
  {
    title: 'App Information & Support',
    rows: [
      { id: 'help', label: 'Help Center & Support', icon: HelpCircle, type: 'nav' },
      { id: 'report', label: 'Report a Problem', icon: Flag, type: 'nav' },
      { id: 'terms', label: 'Terms of Service & Privacy Policy', icon: FileText, type: 'nav' },
      { id: 'about', label: 'About Triptape', sub: 'Version 2.4.1', icon: Info, type: 'nav' },
    ],
  },
];
