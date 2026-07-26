import { useEffect, useState } from "react";
import { Animated, View } from "react-native";
import { COLORS } from "@/constants/theme";

function Shimmer({ style }: { style: object }) {
  const [opacity] = useState(() => new Animated.Value(0.4));
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return (
    <Animated.View
      style={[
        { backgroundColor: COLORS.surface, borderRadius: 8, opacity },
        style,
      ]}
    />
  );
}

export function DetailSkeleton() {
  return (
    <View className="flex-1 bg-bg">
      <Shimmer style={{ width: "100%", height: 360 }} />
      <View className="px-4 pt-4">
        <Shimmer style={{ width: "60%", height: 24, marginBottom: 12 }} />
        <Shimmer style={{ width: "40%", height: 14, marginBottom: 20 }} />
        <Shimmer style={{ width: "100%", height: 60, marginBottom: 20 }} />
        <Shimmer style={{ width: "30%", height: 16, marginBottom: 12 }} />
        <View className="flex-row">
          {[0, 1, 2, 3].map((i) => (
            <Shimmer
              key={i}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                marginRight: 16,
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
