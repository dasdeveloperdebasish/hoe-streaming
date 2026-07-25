import { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
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

  const sectionsWithItems = useMemo(
    () =>
      data?.sections.map((s) => ({ ...s, items: resolve(s.itemIds) })) ?? [],
    [data],
  );

  if (isLoading) return <HomeSkeleton />;
  if (isError || !data) return <ErrorState onRetry={refetch} />;

  const renderSection = ({
    item,
  }: {
    item: Section & { items: Content[] };
  }) => (
    <View className="mb-6">
      <SectionTitle>{item.title}</SectionTitle>
      <Carousel items={item.items} onPressItem={openDetail} />
    </View>
  );

  return (
    <View className="flex-1 bg-bg">
      <FlatList
        data={sectionsWithItems}
        keyExtractor={(s) => s.id}
        renderItem={renderSection}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={COLORS.accent}
            colors={[COLORS.accent]}
          />
        }
        ListHeaderComponent={
          <>
            <HeroBanner
              item={data.hero}
              onPress={() => openDetail(data.hero)}
            />
            <FlatList
              data={data.categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(c) => c.id}
              contentContainerStyle={{
                paddingHorizontal: 16,
                marginBottom: 20,
              }}
              renderItem={({ item }) => (
                <Chip
                  label={item.label}
                  active={activeCat === item.id}
                  onPress={() => setActiveCat(item.id)}
                />
              )}
            />
          </>
        }
      />
    </View>
  );
}
