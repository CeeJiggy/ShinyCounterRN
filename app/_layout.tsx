import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { CounterProvider } from '../src/context/CounterContext';
import { ThemeProvider as CustomThemeProvider, useThemeContext } from '../src/context/ThemeContext';
import { ColorPaletteProvider } from '../src/context/ColorPaletteContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { theme, getThemeColors } = useThemeContext();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const themeColors = getThemeColors();

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <CounterProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          {/* Comment out the tabs for now */}
          {/* <Stack.Screen name="(tabs)" /> */}
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </CounterProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ColorPaletteProvider>
      <CustomThemeProvider>
        <AppContent />
      </CustomThemeProvider>
    </ColorPaletteProvider>
  );
}
