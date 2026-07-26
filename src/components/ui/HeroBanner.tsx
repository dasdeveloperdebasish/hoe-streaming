import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import type { Content } from "@/types/content";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { COLORS, HERO_HEIGHT, HERO_FADE_HEIGHT } from "@/constants/theme";
import { STRINGS } from "@/constants/strings";

type Props = { item: Content; onPress: () => void };

const BLUR = "L6PZfSi_.AyE_3t7t7R**0o#DgR4";

export function HeroBanner({ item, onPress }: Props) {
  const inList = useWatchlistStore((s) => s.ids.includes(item.id));
  const toggleList = useWatchlistStore((s) => s.toggle);

  return (
    <View className="mb-6">
      <View>
        <Image
          source={item.backdropUrl}
          placeholder={{ blurhash: BLUR }}
          contentFit="cover"
          transition={150}
          cachePolicy="memory-disk"
          style={{
            width: "100%",
            height: HERO_HEIGHT,
            backgroundColor: COLORS.surface,
          }}
        />
        <LinearGradient
          colors={["transparent", "rgba(10,10,11,0.6)", COLORS.bg]}
          locations={[0, 0.7, 1]}
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: HERO_FADE_HEIGHT,
          }}
        />
      </View>

      <View className="px-4 -mt-24">
        <Text className="text-ink text-2xl font-semibold">{item.title}</Text>
        <Text className="text-muted text-xs mt-1">
          {item.year} · {item.genres.join(" · ")} · {item.durationLabel}
        </Text>
        <View className="flex-row gap-2 mt-4">
          <Pressable
            onPress={onPress}
            className="bg-accent px-6 py-2.5 rounded-lg"
          >
            <Text className="text-bg text-sm font-semibold">
              ▶ {STRINGS.play}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => toggleList(item.id)}
            className="border border-line px-4 py-2.5 rounded-lg"
          >
            <Text className="text-ink text-sm">
              {inList ? STRINGS.inList : STRINGS.addList}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
