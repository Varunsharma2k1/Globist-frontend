import { useEffect, useMemo, useState } from 'react';
import { getReels } from '../../../api';
import { useTripLedger } from '../../../hooks/useTripLedger';
import { mergeReels } from '../../reels/hooks/useReelsFeed';
import { sameAgency } from '../utils/agencyProfile';

/**
 * Reels that tag this agency: ones travellers posted in the app after a trip
 * with it (on-device ledger) plus backend reels linked to it.
 *
 * @param {Object} agency
 */
export function useAgencyReels(agency) {
  const { ledger } = useTripLedger();
  const [backendReels, setBackendReels] = useState([]);

  useEffect(() => {
    let alive = true;
    getReels()
      .then((data) => alive && setBackendReels(data))
      .catch((error) => console.warn('[useAgencyReels] reels:', error?.message));
    return () => {
      alive = false;
    };
  }, []);

  return useMemo(
    () => mergeReels(backendReels, ledger.reels).filter((r) => sameAgency(r.agency, agency)),
    [backendReels, ledger.reels, agency]
  );
}

export default useAgencyReels;
