import { useEffect, useState } from "react";
import { Animated, View } from "react-native";

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
      style={[{ backgroundColor: "#16161A", borderRadius: 8, opacity }, style]}
    />
  );
}

export function HomeSkeleton() {
  return (
    <View className="flex-1 bg-bg px-4 pt-16">
      <Shimmer style={{ width: "100%", height: 300, marginBottom: 24 }} />
      {[0, 1, 2].map((row) => (
        <View key={row} className="mb-6">
          <Shimmer style={{ width: 140, height: 16, marginBottom: 12 }} />
          <View className="flex-row">
            {[0, 1, 2].map((c) => (
              <Shimmer
                key={c}
                style={{ width: 120, height: 180, marginRight: 12 }}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
