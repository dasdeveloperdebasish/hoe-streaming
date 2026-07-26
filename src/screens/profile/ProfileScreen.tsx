import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeStore } from "@/store/useThemeStore";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { CONTENT } from "@/data/content";
import { SettingsRow } from "@/components/ui/SettingsRow";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Poster } from "@/components/ui/Poster";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "@/navigation/types";
import { useNavigation } from "@react-navigation/native";

const USER = {
  name: "Debasish Das",
  initials: "DD",
  email: "debasish@example.com",
};
type Nav = NativeStackNavigationProp<HomeStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const mode = useThemeStore((s) => s.mode);
  const toggleTheme = useThemeStore((s) => s.toggle);

  const watchlistIds = useWatchlistStore((s) => s.ids);
  const savedShows = watchlistIds
    .map((id) => CONTENT[id])
    .filter((x) => x !== undefined);

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
            {savedShows.length} in your list
          </Text>
        </View>

        {/* My List */}
        <View className="mt-6">
          <SectionTitle>My List</SectionTitle>
          {savedShows.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {savedShows.map((show) => (
                <Poster
                  key={show.id}
                  title={show.title}
                  posterUrl={show.posterUrl}
                  onPress={() =>
                    navigation.navigate("Detail", {
                      id: show.id,
                      title: show.title,
                    })
                  }
                />
              ))}
            </ScrollView>
          ) : (
            <View className="px-4 py-8">
              <Text className="text-muted text-sm text-center">
                Shows you save will appear here.
              </Text>
            </View>
          )}
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
        </View>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
