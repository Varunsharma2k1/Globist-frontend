import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Custom Hook: useTheme
 *
 * Provides the active color palette and appearance mode controls.
 *
 * Usage:
 * ```js
 * const { colors, mode, resolvedScheme, setMode } = useTheme();
 * const styles = useMemo(() => StyleSheet.create({ ... colors.background ... }), [colors]);
 * ```
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default useTheme;
