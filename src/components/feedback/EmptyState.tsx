import { Text, View } from "react-native";

export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <View className="flex-1 bg-bg items-center justify-center px-8">
      <Text className="text-ink text-lg font-medium">{title}</Text>
      <Text className="text-muted text-sm text-center mt-2">{message}</Text>
    </View>
  );
}
