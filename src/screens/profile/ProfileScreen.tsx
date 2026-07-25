import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeStore } from "@/store/useThemeStore";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { SettingsRow } from "@/components/ui/SettingsRow";
import { SectionTitle } from "@/components/ui/SectionTitle";

const USER = {
  name: "Debasish Das",
  initials: "DD",
  email: "debasish@example.com",
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const mode = useThemeStore((s) => s.mode);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const watchlistCount = useWatchlistStore((s) => s.ids.length);

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header card */}
        <View className="items-center py-8 border-b border-line">
          <View className="w-20 h-20 rounded-full bg-surface items-center justify-center">
            <Text className="text-ink text-2xl font-semibold">
              {USER.initials}
            </Text>
          </View>
          <Text className="text-ink text-lg font-medium mt-3">{USER.name}</Text>
          <Text className="text-muted text-sm mt-1">{USER.email}</Text>
          <Text className="text-accent text-xs mt-2">
            {watchlistCount} in your list
          </Text>
        </View>

        {/* Preferences */}
        <View className="mt-6">
          <SectionTitle>Preferences</SectionTitle>
          <SettingsRow
            label="Dark mode"
            isSwitch
            switchValue={mode === "dark"}
            onSwitchChange={toggleTheme}
          />
          <SettingsRow label="Language" value="English" />
          <SettingsRow label="Download quality" value="High" />
          <SettingsRow label="Notifications" />
        </View>

        {/* Account */}
        <View className="mt-6">
          <SectionTitle>Account</SectionTitle>
          <SettingsRow label="Manage devices" />
          <SettingsRow label="Privacy" />
          <SettingsRow label="Log out" />
        </View>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
