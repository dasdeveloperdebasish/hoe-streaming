import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <Text className="text-ink text-2xl font-medium px-4 pt-2">Search</Text>
    </View>
  );
}
