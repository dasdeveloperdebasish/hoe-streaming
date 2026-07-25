import { useCallback, useMemo } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useContentDetail, useRelatedContent } from "@/hooks/useContentDetail";
import type { Content } from "@/types/content";
import type { HomeStackParamList } from "@/navigation/types";
import { COLORS } from "@/constants/theme";
import { Tag } from "@/components/ui/Tag";
import { CastCard } from "@/components/ui/CastCard";
import { Carousel } from "@/components/ui/Carousel";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DetailSkeleton } from "@/components/feedback/DetailSkeleton";
import { ErrorState } from "@/components/feedback/ErrorState";

type Props = NativeStackScreenProps<HomeStackParamList, "Detail">;
type Nav = NativeStackNavigationProp<HomeStackParamList, "Detail">;

const HEADER_HEIGHT = 360;

export default function DetailScreen({ route }: Props) {
  const { id } = route.params;
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const { data, isLoading, isError, refetch } = useContentDetail(id);
  const { data: related } = useRelatedContent(data?.relatedIds ?? []);

  // Drives the header shrink/fade as the user scrolls.
  const scrollY = useMemo(() => new Animated.Value(0), []);

  const openDetail = useCallback(
    (item: Content) =>
      navigation.push("Detail", { id: item.id, title: item.title }),
    [navigation],
  );

  if (isLoading) return <DetailSkeleton />;
  if (isError || !data) return <ErrorState onRetry={refetch} />;

  // Image scales up as you pull down, fades slightly as you scroll up.
  const imageScale = scrollY.interpolate({
    inputRange: [-200, 0],
    outputRange: [1.4, 1],
    extrapolateRight: "clamp",
  });
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - 100],
    outputRange: [1, 0.3],
    extrapolate: "clamp",
  });

  return (
    <View className="flex-1 bg-bg">
      {/* Fixed back button, respects the notch */}
      <Pressable
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          top: insets.top + 8,
          left: 16,
          zIndex: 10,
        }}
        className="w-9 h-9 rounded-full items-center justify-center"
        hitSlop={8}
      >
        <View className="w-9 h-9 rounded-full bg-bg/60 items-center justify-center">
          <Text className="text-ink text-lg">‹</Text>
        </View>
      </Pressable>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        {/* Animated hero header */}
        <Animated.View
          style={{
            height: HEADER_HEIGHT,
            opacity: imageOpacity,
            overflow: "hidden",
          }}
        >
          <Animated.Image
            source={{ uri: data.backdropUrl }}
            style={{
              width: "100%",
              height: HEADER_HEIGHT,
              transform: [{ scale: imageScale }],
            }}
          />
          <LinearGradient
            colors={["transparent", COLORS.bg]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 160,
            }}
          />
        </Animated.View>

        {/* Body */}
        <View className="px-4 pt-4">
          <Text className="text-ink text-2xl font-semibold">{data.title}</Text>

          <View className="flex-row flex-wrap mt-3">
            <Tag label={String(data.year)} />
            <Tag label={data.rating} />
            <Tag label={data.durationLabel} />
            {data.genres.map((g) => (
              <Tag key={g} label={g} />
            ))}
          </View>

          <View className="flex-row gap-2 mt-2 mb-6">
            <Pressable
              onPress={() =>
                navigation.push("Player", {
                  videoUrl: data.videoUrl,
                  title: data.title,
                })
              }
              className="bg-accent px-6 py-2.5 rounded-lg flex-1 items-center"
            >
              <Text className="text-bg text-sm font-semibold">▶ Play</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                navigation.push("WebContent", {
                  url: "https://en.wikipedia.org/wiki/Streaming_media",
                  title: `About ${data.title}`,
                })
              }
              className="border border-line px-4 py-2.5 rounded-lg items-center justify-center"
            >
              <Text className="text-ink text-sm">ⓘ More info</Text>
            </Pressable>
            <Pressable className="border border-line px-4 py-2.5 rounded-lg items-center justify-center">
              <Text className="text-ink text-sm">+ My List</Text>
            </Pressable>
          </View>

          <Text className="text-muted text-sm leading-5 mb-6">
            {data.description}
          </Text>

          <SectionTitle>Cast</SectionTitle>
          <View className="flex-row mb-6">
            {data.cast.map((m) => (
              <CastCard key={m.id} member={m} />
            ))}
          </View>
        </View>

        {/* More like this — full-width carousel */}
        {related && related.length > 0 && (
          <View className="mb-8">
            <SectionTitle>More like this</SectionTitle>
            <Carousel items={related} onPressItem={openDetail} />
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
}
