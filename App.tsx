import "./global.css";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { PaperProvider, MD3DarkTheme } from "react-native-paper";
import { queryClient } from "@/services/queryClient";
import { useThemeStore } from "@/store/useThemeStore";
import { COLORS } from "@/constants/theme";
import RootNavigator from "@/navigation/RootNavigator";
import { CONTENT } from "@/data/content";
import { Image } from "expo-image";

const paperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.accent,
    background: COLORS.bg,
    surface: COLORS.surface,
    onSurface: COLORS.ink,
  },
};

export default function App() {
  const mode = useThemeStore((s) => s.mode);
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(mode);
  }, [mode, setColorScheme]);

  useEffect(() => {
    const posters = Object.values(CONTENT).map((c) => c.posterUrl);
    const backdrops = Object.values(CONTENT).map((c) => c.backdropUrl);
    Image.prefetch([...posters, ...backdrops], { cachePolicy: "memory-disk" });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={paperTheme}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style={mode === "dark" ? "light" : "dark"} />
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </QueryClientProvider>
  );
}
