import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import {
  useFonts,
  Archivo_400Regular,
  Archivo_600SemiBold,
  Archivo_700Bold,
  Archivo_800ExtraBold,
} from '@expo-google-fonts/archivo';

import { AuthProvider } from './src/context/AuthContext';
import { SettingsProvider } from './src/context/SettingsContext';
import { CommunitiesProvider } from './src/context/CommunitiesContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { useTheme } from './src/hooks/useTheme';
import { useSettings } from './src/hooks/useSettings';
import TouchIndicator from './src/components/TouchIndicator';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/theme';

function AppContent() {
  const { colors, resolvedScheme } = useTheme();
  const { settings } = useSettings();

  const navTheme = {
    ...(resolvedScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(resolvedScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.divider,
      primary: colors.ink,
    },
  };

  return (
    <TouchIndicator enabled={settings.toggles.showTouches}>
      <NavigationContainer theme={navTheme}>
        <StatusBar
          style={resolvedScheme === 'dark' ? 'light' : 'dark'}
          backgroundColor={colors.background}
        />
        <AppNavigator />
      </NavigationContainer>
    </TouchIndicator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_600SemiBold,
    Archivo_700Bold,
    Archivo_800ExtraBold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: COLORS.background }} />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <SettingsProvider>
            <CommunitiesProvider>
              <AppContent />
            </CommunitiesProvider>
          </SettingsProvider>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
