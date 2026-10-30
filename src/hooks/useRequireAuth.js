import { useCallback } from 'react';
import { useAuth } from './useAuth';

/**
 * Gate for actions that need a real account (booking, posting reels).
 *
 * `requireAuth(redirect)` returns true when someone is signed in. For
 * guests it opens the sign-in sheet instead and returns false; once they
 * sign in, the sheet replaces itself with `redirect` ({ name, params }) so
 * they land where they were headed.
 *
 * ```js
 * const { requireAuth } = useRequireAuth(navigation);
 * if (requireAuth({ name: 'Booking', params })) navigation.navigate('Booking', params);
 * ```
 */
export function useRequireAuth(navigation) {
  const { user } = useAuth();
  const isSignedIn = Boolean(user && !user.isGuest);

  const requireAuth = useCallback(
    (redirect) => {
      if (isSignedIn) return true;
      navigation.navigate('Auth', { redirect });
      return false;
    },
    [isSignedIn, navigation]
  );

  return { isSignedIn, requireAuth };
}

export default useRequireAuth;
