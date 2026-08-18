import { Alert } from 'react-native';
import { Briefcase, Heart, CreditCard, Bell, LogOut } from 'lucide-react-native';

export const TIER_EMOJI = {
  gold: '🥇',
  silver: '🥈',
  diamond: '💎',
};

export const getMenuItems = (navigation, logout) => [
  { id: 'mytrips', label: 'My Trips', icon: Briefcase, onPress: () => navigation.navigate('MyTrips') },
  { id: 'saved', label: 'Saved Trips', icon: Heart, onPress: () => Alert.alert('Saved Trips', 'Coming soon.') },
  { id: 'payments', label: 'Payment Methods', icon: CreditCard, onPress: () => Alert.alert('Payment Methods', 'Coming soon.') },
  { id: 'notifications', label: 'Notifications', icon: Bell, onPress: () => Alert.alert('Notifications', 'Coming soon.') },
  { id: 'logout', label: 'Log Out', icon: LogOut, onPress: logout },
];
