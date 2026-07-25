import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";

type Props = {
  title: string;
  posterUrl: string;
  progress?: number;
  width?: number;
  onPress: () => void;
};

const BLUR = "L6PZfSi_.AyE_3t7t7R**0o#DgR4";

function PosterBase({
  title,
  posterUrl,
  progress,
  width = 120,
  onPress,
}: Props) {
  return (
    <Pressable onPress={onPress} className="mr-3" style={{ width }}>
      <Image
        source={posterUrl}
        placeholder={BLUR}
        contentFit="cover"
        transition={200}
        style={{
          width,
          height: width * 1.5,
          borderRadius: 8,
          backgroundColor: "#16161A",
        }}
      />
      {progress !== undefined && (
        <View className="h-[3px] bg-line rounded-full mt-1.5">
          <View
            className="h-[3px] bg-accent rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </View>
      )}
      <Text numberOfLines={1} className="text-muted text-xs mt-1.5">
        {title}
      </Text>
    </Pressable>
  );
}

export const Poster = memo(PosterBase);
