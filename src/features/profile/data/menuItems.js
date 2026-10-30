import { demoCounts } from '../utils/demoCounts';
import {
  Briefcase,
  Heart,
  Film,
  Tag,
  LogOut,
  Mountain,
  Receipt,
  Wallet,
} from 'lucide-react-native';

/**
 * @param {{ tripsCount?: number, walletBalance?: number }} [ledger] - how
 *   many trips My Trips lists (useBookedTripsCount) and the wallet balance
 */
export const getMenuItems = (navigation, logout, role, userId, ledger = {}) => {
  const counts = demoCounts(userId);
  const logoutItem = { id: 'logout', label: 'Log Out', icon: LogOut, onPress: logout };

  // Agency accounts manage their listed packages and see who booked them.
  if (role === 'agency') {
    return [
      {
        id: 'packages',
        label: 'Himalayan Treks',
        icon: Mountain,
        onPress: () => navigation.navigate('AgencyPackages'),
      },
      {
        id: 'payments',
        label: 'Payment History',
        icon: Receipt,
        onPress: () => navigation.navigate('PaymentHistory'),
      },
      {
        id: 'tagged',
        label: 'Tagged Reels',
        icon: Tag,
        onPress: () => navigation.navigate('MyReels', { kind: 'tagged' }),
      },
      logoutItem,
    ];
  }

  return [
    {
      id: 'mytrips',
      label: 'My Trips',
      icon: Briefcase,
      count: ledger.tripsCount || counts.trips,
      onPress: () => navigation.navigate('ProfileTrips', { kind: 'booked' }),
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: Wallet,
      count: `₹${(ledger.walletBalance || 0).toLocaleString('en-IN')}`,
      onPress: () => navigation.navigate('Wallet'),
    },
    {
      id: 'saved',
      label: 'Saved Trips',
      icon: Heart,
      count: counts.saved,
      onPress: () => navigation.navigate('ProfileTrips', { kind: 'saved' }),
    },
    {
      id: 'myreels',
      label: 'My Posts',
      icon: Film,
      onPress: () => navigation.navigate('MyReels'),
    },
    logoutItem,
  ];
};
