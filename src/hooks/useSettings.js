import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';

/**
 * Custom Hook: useSettings
 *
 * Provides access to persisted Settings-screen preferences (toggle groups,
 * feed preference) and the setters to update them.
 *
 * Usage:
 * ```js
 * const { settings, toggleSetting, setFeedPref } = useSettings();
 * ```
 */
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default useSettings;
