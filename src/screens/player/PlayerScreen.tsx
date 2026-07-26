import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, Pressable, View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useNavigation } from "@react-navigation/native";
import type {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import type { RootStackParamList } from "@/navigation/types";
import { COLORS } from "@/constants/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Player">;
type Nav = NativeStackNavigationProp<RootStackParamList, "Player">;

const { width } = Dimensions.get("window");
const VIDEO_HEIGHT = width * (9 / 16);

export default function PlayerScreen({ route }: Props) {
  const { videoUrl } = route.params;
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<VideoView>(null);

  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = false;
    p.play();
  });

  // Hide spinner when ready.
  useEffect(() => {
    const sub = player.addListener("statusChange", ({ status }) => {
      if (status === "readyToPlay") setLoading(false);
    });
    return () => sub.remove();
  }, [player]);

  // Allow rotation while on the player; restore portrait on exit.
  useEffect(() => {
    ScreenOrientation.unlockAsync();
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );
    };
  }, []);

  return (
    <View className="flex-1 bg-black">
      {/* Dismiss button */}
      <Pressable
        onPress={() => navigation.goBack()}
        hitSlop={12}
        style={{
          position: "absolute",
          top: insets.top + 12,
          left: 16,
          zIndex: 20,
        }}
        className="w-10 h-10 rounded-full bg-black/50 items-center justify-center"
      >
        <Ionicons name="chevron-down" size={22} color={COLORS.ink} />
      </Pressable>

      <View className="flex-1 justify-center">
        <VideoView
          ref={videoRef}
          player={player}
          style={{ width, height: VIDEO_HEIGHT }}
          contentFit="contain"
          nativeControls
        />
        {loading && (
          <View className="absolute inset-0 items-center justify-center">
            <ActivityIndicator color={COLORS.accent} size="large" />
          </View>
        )}
      </View>
    </View>
  );
}
