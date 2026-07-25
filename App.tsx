import "./global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { queryClient } from "@/services/queryClient";
import RootTabs from "@/navigation/RootTabs";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <RootTabs />
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
