import { Pressable, Text, View } from "react-native";

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="flex-1 bg-bg items-center justify-center px-8">
      <Text className="text-ink text-lg font-medium">Couldn't load shows</Text>
      <Text className="text-muted text-sm text-center mt-2">
        Check your connection and try again.
      </Text>
      <Pressable
        onPress={onRetry}
        className="bg-ink px-6 py-2.5 rounded-lg mt-5"
      >
        <Text className="text-bg text-sm font-semibold">Retry</Text>
      </Pressable>
    </View>
  );
}
