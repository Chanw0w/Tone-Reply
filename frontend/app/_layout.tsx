import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { LogBox } from "react-native";
import { useFonts } from "expo-font";

import { useIconFonts } from "@/src/hooks/use-icon-fonts";
import { AuthProvider } from "../src/utils/auth-context";
import { ThemeProvider } from "../src/utils/theme-context";


// Disable logbox errors etc so that users can see the app
// and agent works as expected.
LogBox.ignoreAllLogs(true)

// Keep the native splash visible from cold start until icon fonts register.
// Required because @expo/vector-icons' componentDidMount fallback fires
// Font.loadAsync against a broken vendor path if any <Icon> mounts before
// the family is registered — which throws on Android Expo Go.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [iconFontsLoaded, iconFontsError] = useIconFonts();

  // Load custom serif fonts for retro vibe
  const [fontsLoaded, fontsError] = useFonts({
    'Poppins_400Regular': require('../assets/fonts/Poppins_400Regular.ttf'),
    'Poppins_700Bold': require('../assets/fonts/Poppins_700Bold.ttf'),
    'Poppins_900Black': require('../assets/fonts/Poppins_900Black.ttf'),
  });

  const loaded = iconFontsLoaded && fontsLoaded;
  const error = iconFontsError || fontsError;

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // If the CDN is unreachable we fall through on error rather than wedging
  // the app — icons will tofu, but the app still boots.
  if (!loaded && !error) return null;

  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </ThemeProvider>
  );
}
