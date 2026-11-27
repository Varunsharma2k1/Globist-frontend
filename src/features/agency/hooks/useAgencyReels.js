import { useEffect, useMemo, useState } from 'react';
import { getAgencyReels } from '../../../api/reels';
import { useTripLedger } from '../../../hooks/useTripLedger';
import { mergeReels } from '../../reels/hooks/useReelsFeed';
import { sameAgency } from '../utils/agencyProfile';

/**
 * Reels that tag this agency: every traveller's verified tape from the server
 * (GET /reels/agency/:id — all users, not just this phone) plus this
 * device's own tapes that may still be processing.
 *
 * @param {Object} agency
 */
export function useAgencyReels(agency) {
  const { ledger } = useTripLedger();
  const [backendReels, setBackendReels] = useState([]);

  const agencyId = agency?._id;

  useEffect(() => {
    if (!/^[a-f0-9]{24}$/.test(String(agencyId || ''))) return undefined; // app-only demo agency
    let alive = true;
    getAgencyReels(agencyId)
      .then((data) => alive && setBackendReels(data))
      .catch((error) => console.warn('[useAgencyReels] reels:', error?.message));
    return () => {
      alive = false;
    };
  }, [agencyId]);

  return useMemo(
    () => mergeReels(backendReels, ledger.reels).filter((r) => sameAgency(r.agency, agency)),
    [backendReels, ledger.reels, agency]
  );
}

export default useAgencyReels;
