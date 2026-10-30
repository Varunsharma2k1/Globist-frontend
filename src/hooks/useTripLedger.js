import { useContext, useMemo } from 'react';
import { TripLedgerContext } from '../context/TripLedgerContext';
import { useAuth } from './useAuth';
import { walletFor } from '../features/wallet/utils/ledger';

/**
 * Custom Hook: useTripLedger
 *
 * The on-device bookings / reels / wallet store, plus the signed-in user's
 * own slice of it.
 *
 * ```js
 * const { myBookings, wallet, bookTrip, postReel } = useTripLedger();
 * ```
 */
export const useTripLedger = () => {
  const context = useContext(TripLedgerContext);
  if (!context) {
    throw new Error('useTripLedger must be used within a TripLedgerProvider');
  }
  const { user } = useAuth();
  const userId = user?._id;
  const { ledger } = context;

  const myBookings = useMemo(
    () => (userId ? ledger.bookings.filter((b) => b.userId === userId) : []),
    [ledger.bookings, userId]
  );
  const wallet = useMemo(() => walletFor(ledger, userId), [ledger, userId]);

  return { ...context, myBookings, wallet };
};

export default useTripLedger;
