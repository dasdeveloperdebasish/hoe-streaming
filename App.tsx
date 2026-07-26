import "./global.css";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { queryClient } from "@/services/queryClient";
import { useThemeStore } from "@/store/useThemeStore";
import RootTabs from "@/navigation/RootTabs";

export default function App() {
  const mode = useThemeStore((s) => s.mode);
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(mode);
  }, [mode, setColorScheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style={mode === "dark" ? "light" : "dark"} />
          <RootTabs />
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
