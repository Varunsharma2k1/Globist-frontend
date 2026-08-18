import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import {
  useFonts,
  Archivo_400Regular,
  Archivo_800ExtraBold,
} from '@expo-google-fonts/archivo';

import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { COLORS } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_800ExtraBold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: COLORS.background }} />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="dark" backgroundColor={COLORS.background} />
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
