import { Heart, MessageCircle, UserPlus, BadgeCheck, MapPin } from 'lucide-react-native';

// Notifications/Communities need theme colors (icon tones, pastel tiles), so
// they're factory functions of `colors` rather than plain constants — they
// must only be called inside a component that already has `colors` from
// useTheme(), never at module load time.

export const TABS = [
  { key: 'notifications', label: 'Notifications' },
  { key: 'chat', label: 'Chat' },
  { key: 'communities', label: 'Communities' },
];
