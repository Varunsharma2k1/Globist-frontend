import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config';
import {
  EMPTY_LEDGER,
  addBooking,
  addReel,
  completeBooking,
  settleFinishedTrips,
} from '../features/wallet/utils/ledger';

/**
 * Trip Ledger Context
 *
 * Frontend-only store for booked trips, the reels travellers post about
 * them, and the wallet credits those reels earn (see
 * features/wallet/utils/ledger for the rules). Persisted to AsyncStorage as
 * one JSON blob until the backend has bookings/wallet endpoints for this.
 */
export const TripLedgerContext = createContext();

export const TripLedgerProvider = ({ children }) => {
  const [ledger, setLedger] = useState(EMPTY_LEDGER);
  const [ready, setReady] = useState(false);
  // Actions read the latest state from here so back-to-back calls (e.g.
  // book, then immediately read it back) never see a stale render.
  const ledgerRef = useRef(EMPTY_LEDGER);

  const commit = useCallback((next) => {
    ledgerRef.current = next;
    setLedger(next);
    AsyncStorage.setItem(STORAGE_KEYS.TRIP_LEDGER, JSON.stringify(next)).catch((error) =>
      console.warn('[TripLedger] save failed:', error?.message)
    );
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.TRIP_LEDGER)
      .then((raw) => {
        const stored = raw ? { ...EMPTY_LEDGER, ...JSON.parse(raw) } : EMPTY_LEDGER;
        // Trips whose return date has passed since the last launch complete now.
        commit(settleFinishedTrips(stored));
      })
      .catch((error) => console.warn('[TripLedger] load failed:', error?.message))
      .finally(() => setReady(true));
  }, [commit]);

  const bookTrip = useCallback(
    (details) => {
      const { state, booking } = addBooking(ledgerRef.current, details);
      commit(state);
      return booking;
    },
    [commit]
  );

  const markTripCompleted = useCallback(
    (bookingId) => commit(completeBooking(ledgerRef.current, bookingId)),
    [commit]
  );

  /** @returns {{ reel, reward }} — throws if the tagged booking isn't eligible */
  const postReel = useCallback(
    (details) => {
      const { state, reel, reward } = addReel(ledgerRef.current, details);
      commit(state);
      return { reel, reward };
    },
    [commit]
  );

  const value = useMemo(
    () => ({ ledger, ready, bookTrip, markTripCompleted, postReel }),
    [ledger, ready, bookTrip, markTripCompleted, postReel]
  );

  return <TripLedgerContext.Provider value={value}>{children}</TripLedgerContext.Provider>;
};
