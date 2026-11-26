import { Heart, MessageCircle, UserPlus, BadgeCheck, MapPin } from 'lucide-react-native';

// Notifications/Communities need theme colors (icon tones, pastel tiles), so
// they're factory functions of `colors` rather than plain constants — they
// must only be called inside a component that already has `colors` from
// useTheme(), never at module load time.
export const getNotifications = (colors) => [
  {
    id: 'n1',
    icon: Heart,
    tone: colors.error,
    text: '@wanderlust_kate liked your tape from Manali.',
    time: '2h',
    unread: true,
  },
  {
    id: 'n2',
    icon: MessageCircle,
    tone: colors.ink,
    text: '@travel_with_sam commented: "How much did this trip cost?"',
    time: '5h',
    unread: true,
  },
  {
    id: 'n3',
    icon: UserPlus,
    tone: colors.success,
    text: '@rishikesh_vibes started following you.',
    time: '1d',
    unread: false,
  },
  {
    id: 'n4',
    icon: BadgeCheck,
    tone: colors.pastel.mountain.fg,
    text: 'Himalayan High Treks verified your booking for Spiti Valley.',
    time: '2d',
    unread: false,
  },
  {
    id: 'n5',
    icon: MapPin,
    tone: colors.pastel.beach.fg,
    text: 'New trending tapes posted near Goa.',
    time: '3d',
    unread: false,
  },
];

export const TABS = [
  { key: 'notifications', label: 'Notifications' },
  { key: 'chat', label: 'Chat' },
  { key: 'communities', label: 'Communities' },
];
