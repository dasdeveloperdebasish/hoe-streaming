import { useCallback, useState } from "react";
import { FlatList, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSearch } from "@/hooks/useSearch";
import type { Content } from "@/types/content";
import type { HomeStackParamList } from "@/navigation/types";
import { COLORS } from "@/constants/theme";
import { SearchResultRow } from "@/components/ui/SearchResultRow";
import { EmptyState } from "@/components/feedback/EmptyState";

type Nav = NativeStackNavigationProp<HomeStackParamList>;

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState("");
  const { data, isFetching } = useSearch(query);

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

  const trimmed = query.trim();
  const showEmpty =
    trimmed.length > 0 && !isFetching && (data?.length ?? 0) === 0;

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-3">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search shows, movies, genres"
          placeholderTextColor={COLORS.muted}
          className="bg-surface text-ink px-4 py-3 rounded-lg"
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      {trimmed.length === 0 ? (
        <EmptyState
          title="Find something to watch"
          message="Search by title or genre."
        />
      ) : showEmpty ? (
        <EmptyState
          title="No results"
          message={`Nothing found for "${trimmed}".`}
        />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={8}
          windowSize={5}
          removeClippedSubviews
        />
      )}
    </View>
  );
}
