import { useCallback } from "react";
import { FlatList, type ListRenderItem } from "react-native";
import type { Content } from "@/types/content";
import { Poster } from "./Poster";

type Props = { items: Content[]; onPressItem: (item: Content) => void };

export function Carousel({ items, onPressItem }: Props) {
  const renderItem: ListRenderItem<Content> = useCallback(
    ({ item }) => (
      <Poster
        title={item.title}
        posterUrl={item.posterUrl}
        progress={item.progress}
        onPress={() => onPressItem(item)}
      />
    ),
    [onPressItem],
  );

  const keyExtractor = useCallback((item: Content) => item.id, []);

  return (
    <FlatList
      data={items}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      initialNumToRender={4}
      maxToRenderPerBatch={6}
      windowSize={5}
      removeClippedSubviews
    />
  );
}
