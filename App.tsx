import "./global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { queryClient } from "@/services/queryClient";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <View className="flex-1 items-center justify-center bg-bg">
          <Text className="text-accent text-2xl font-medium">
            Providers ready
          </Text>
        </View>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
