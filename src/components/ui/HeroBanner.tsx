import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import type { Content } from "@/types/content";
import { COLORS, HERO_HEIGHT, HERO_FADE_HEIGHT } from "@/constants/theme";

type Props = { item: Content; onPress: () => void };

export function HeroBanner({ item, onPress }: Props) {
  return (
    <View className="mb-6">
      <View>
        <Image
          source={item.backdropUrl}
          contentFit="cover"
          transition={200}
          style={{
            width: "100%",
            height: HERO_HEIGHT,
            backgroundColor: COLORS.surface,
          }}
        />
        {/* Fade the image into the page background so text stays readable */}
        <LinearGradient
          colors={["transparent", "rgba(10,10,11,0.6)", COLORS.bg]}
          locations={[0, 0.7, 1]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: HERO_FADE_HEIGHT,
          }}
        />
      </View>

      {/* Text sits on the faded zone, not overlapping the raw image */}
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
            <Text className="text-bg text-sm font-semibold">▶ Play</Text>
          </Pressable>
          <Pressable className="border border-line px-4 py-2.5 rounded-lg">
            <Text className="text-ink text-sm">+ My List</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
