import { memo } from "react";
import { Pressable, Text } from "react-native";

type Props = { label: string; active: boolean; onPress: () => void };

function ChipBase({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-3.5 py-1.5 rounded-full mr-2 ${active ? "bg-accent" : "border border-line"}`}
    >
      <Text
        className={`text-xs ${active ? "text-bg font-medium" : "text-muted"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export const Chip = memo(ChipBase);
