import { Pressable, Switch, Text } from "react-native";
import { COLORS } from "@/constants/theme";

type Props = {
  label: string;
  value?: string;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (v: boolean) => void;
  onPress?: () => void;
};

export function SettingsRow({
  label,
  value,
  isSwitch,
  switchValue,
  onSwitchChange,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between px-4 py-4 border-b border-line"
    >
      <Text className="text-ink text-sm">{label}</Text>
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: COLORS.line, true: COLORS.accent }}
          thumbColor={COLORS.ink}
        />
      ) : (
        <Text className="text-muted text-sm">{value ?? "›"}</Text>
      )}
    </Pressable>
  );
}
