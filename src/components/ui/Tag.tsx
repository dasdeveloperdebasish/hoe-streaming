import { memo } from "react";
import { Text, View } from "react-native";

function TagBase({ label }: { label: string }) {
  return (
    <View className="border border-line rounded px-2 py-1 mr-2 mb-2">
      <Text className="text-muted text-xs">{label}</Text>
    </View>
  );
}

export const Tag = memo(TagBase);
