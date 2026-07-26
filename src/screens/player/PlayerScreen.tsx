import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  Text,
  View,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackScreenProps , NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { HomeStackParamList } from "@/navigation/types";
import { COLORS } from "@/constants/theme";
import * as ScreenOrientation from "expo-screen-orientation";

type Props = NativeStackScreenProps<HomeStackParamList, "Player">;
type Nav = NativeStackNavigationProp<HomeStackParamList, "Player">;

const { width } = Dimensions.get("window");
const VIDEO_HEIGHT = width * (9 / 16); // 16:9 aspect ratio

export default function PlayerScreen({ route }: Props) {
  const { videoUrl, title } = route.params;
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<VideoView>(null);

  // Create a player bound to this show's video; autoplay on mount.
  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = false;
    p.play();
  });

  // Hide the spinner once the video is ready to play.
  useEffect(() => {
    const sub = player.addListener("statusChange", ({ status }) => {
      if (status === "readyToPlay") setLoading(false);
    });
    return () => sub.remove();
  }, [player]);

  useEffect(() => {
    ScreenOrientation.unlockAsync(); // allow landscape on this screen
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );
    };
  }, []);

  const goFullscreen = () => videoRef.current?.enterFullscreen();

  return (
    <View className="flex-1 bg-black">
      {/* Back button, floating over the top */}
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

      {/* Video centered vertically, full width */}
      <View className="flex-1 justify-center">
        <View style={{ width, height: VIDEO_HEIGHT, backgroundColor: "#000" }}>
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

        {/* Title + fullscreen button below the video */}
        <View className="px-5 mt-6">
          <Text className="text-ink text-xl font-semibold">{title}</Text>

          <Pressable
            onPress={goFullscreen}
            className="flex-row items-center mt-4 bg-surface self-start px-4 py-2.5 rounded-lg"
          >
            <Ionicons name="expand" size={16} color={COLORS.ink} />
            <Text className="text-ink text-sm ml-2">Fullscreen</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
