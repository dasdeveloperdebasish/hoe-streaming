import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import type { Content } from "@/types/content";
import { COLORS } from "@/constants/theme";

type Props = { item: Content; onPress: () => void };

function SearchResultRowBase({ item, onPress }: Props) {
  return (
    <Pressable onPress={onPress} className="flex-row px-4 py-2.5 items-center">
      <Image
        source={item.posterUrl}
        contentFit="cover"
        transition={200}
        style={{
          width: 56,
          height: 84,
          borderRadius: 6,
          backgroundColor: COLORS.surface,
        }}
      />
      <View className="flex-1 ml-3">
        <Text className="text-ink text-sm font-medium" numberOfLines={1}>
          {item.title}
        </Text>
        <Text className="text-muted text-xs mt-1">
          {item.year} · {item.genres.join(", ")}
        </Text>
        <Text className="text-muted text-xs mt-0.5">{item.durationLabel}</Text>
      </View>
    </Pressable>
  );
}

export const SearchResultRow = memo(SearchResultRowBase);
