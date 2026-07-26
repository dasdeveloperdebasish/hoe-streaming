import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSearch } from "@/hooks/useSearch";
import type { Content } from "@/types/content";
import type { HomeStackParamList } from "@/navigation/types";
import { COLORS } from "@/constants/theme";
import { SearchResultRow } from "@/components/ui/SearchResultRow";
import { EmptyState } from "@/components/feedback/EmptyState";
import { STRINGS } from "@/constants/strings";

type Nav = NativeStackNavigationProp<HomeStackParamList>;

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState("");

  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearch(query);

  // Flatten all loaded pages into a single list.
  const results = data?.pages.flatMap((p) => p.items) ?? [];

  const openDetail = useCallback(
    (item: Content) =>
      navigation.navigate("Detail", { id: item.id, title: item.title }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Content }) => (
      <SearchResultRow item={item} onPress={() => openDetail(item)} />
    ),
    [openDetail],
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const trimmed = query.trim();
  const showEmpty = trimmed.length > 0 && !isFetching && results.length === 0;

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-3">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={STRINGS.searchPlaceholder}
          placeholderTextColor={COLORS.muted}
          className="bg-surface text-ink rounded-lg"
          style={{ paddingHorizontal: 16, paddingVertical: 12 }}
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      {trimmed.length === 0 ? (
        <EmptyState
          title={STRINGS.searchPrompt}
          message={STRINGS.searchPromptHint}
        />
      ) : showEmpty ? (
        <EmptyState
          title={STRINGS.noResultsTitle}
          message={`Nothing found for "${trimmed}".`}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={8}
          windowSize={5}
          removeClippedSubviews
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4">
                <ActivityIndicator color={COLORS.accent} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}
