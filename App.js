import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';

import { AuthProvider } from './src/context/AuthContext';
import { SettingsProvider } from './src/context/SettingsContext';
import { CommunitiesProvider } from './src/context/CommunitiesContext';
import { TripLedgerProvider } from './src/context/TripLedgerContext';
import { ChatProvider } from './src/context/ChatContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { useTheme } from './src/hooks/useTheme';
import { useSettings } from './src/hooks/useSettings';
import TouchIndicator from './src/components/TouchIndicator';
import AppNavigator from './src/navigation/AppNavigator';
import { useImmersiveNavBar } from './src/hooks/useImmersiveNavBar';
import { COLORS } from './src/theme';

function AppContent() {
  const { colors, resolvedScheme } = useTheme();
  useImmersiveNavBar(); // hide Android's back/home bar; swipe up to peek
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
      Inter_400Regular,
      Inter_600SemiBold,
    });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: COLORS.background }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider>
            <SettingsProvider>
              <CommunitiesProvider>
                <TripLedgerProvider>
                  <ChatProvider>
                    <AppContent />
                  </ChatProvider>
                </TripLedgerProvider>
              </CommunitiesProvider>
            </SettingsProvider>
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
