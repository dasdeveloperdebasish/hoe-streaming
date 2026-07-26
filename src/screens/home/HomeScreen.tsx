import { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, ScrollView, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHomeFeed } from "@/hooks/useHomeFeed";
import { CONTENT } from "@/data/content";
import type { Content, ContentDetail, Section } from "@/types/content";
import type { HomeStackParamList } from "@/navigation/types";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { Carousel } from "@/components/ui/Carousel";
import { Chip } from "@/components/ui/Chip";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { HomeSkeleton } from "@/components/feedback/HomeSkeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { EmptyState } from "@/components/feedback/EmptyState";
import { COLORS } from "@/constants/theme";

type Nav = NativeStackNavigationProp<HomeStackParamList, "HomeFeed">;

function resolve(ids: string[]): Content[] {
  return ids
    .map((id) => CONTENT[id])
    .filter((x): x is ContentDetail => x !== undefined);
}

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { data, isLoading, isError, refetch, isRefetching } = useHomeFeed();
  const [activeCat, setActiveCat] = useState("all");

  const openDetail = useCallback(
    (item: Content) =>
      navigation.navigate("Detail", { id: item.id, title: item.title }),
    [navigation],
  );

  const sectionsWithItems = useMemo(() => {
    if (!data) return [];

    return data.sections
      .map((s) => {
        let items = resolve(s.itemIds);
        if (activeCat !== "all") {
          items = items.filter((item) =>
            item.genres.some(
              (g) => g.toLowerCase() === activeCat.toLowerCase(),
            ),
          );
        }
        return { ...s, items };
      })
      .filter((s) => s.items.length > 0);
  }, [data, activeCat]);

  const renderSection = useCallback(
    ({ item }: { item: Section & { items: Content[] } }) => (
      <View className="mb-6">
        <SectionTitle>{item.title}</SectionTitle>
        <Carousel items={item.items} onPressItem={openDetail} />
      </View>
    ),
    [openDetail],
  );

  if (isLoading) return <HomeSkeleton />;
  if (isError || !data) return <ErrorState onRetry={refetch} />;

  const ListHeader = (
    <>
      <HeroBanner item={data.hero} onPress={() => openDetail(data.hero)} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 20 }}
      >
        {data.categories.map((c) => (
          <Chip
            key={c.id}
            label={c.label}
            active={activeCat === c.id}
            onPress={() => setActiveCat(c.id)}
          />
        ))}
      </ScrollView>
    </>
  );

  return (
    <View className="flex-1 bg-bg">
      <FlatList
        data={sectionsWithItems}
        keyExtractor={(s) => s.id}
        renderItem={renderSection}
        showsVerticalScrollIndicator={false}
        initialNumToRender={3}
        windowSize={5}
        removeClippedSubviews
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={COLORS.accent}
            colors={[COLORS.accent]}
          />
        }
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <EmptyState
            title="Nothing here yet"
            message="No shows in this category."
          />
        }
      />
    </View>
  );
}
