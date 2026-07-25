import { useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { WebView, type WebViewMessageEvent } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { HomeStackParamList } from "@/navigation/types";
import { COLORS } from "@/constants/theme";

type Props = NativeStackScreenProps<HomeStackParamList, "WebContent">;
type Nav = NativeStackNavigationProp<HomeStackParamList, "WebContent">;

// Injected into the page. Sends a message back to the app when a link is tapped
// and reports the page title once loaded. This is the JS bridge.
const INJECTED_JS = `
  (function() {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: "loaded",
      title: document.title
    }));
    document.addEventListener("click", function(e) {
      var link = e.target.closest("a");
      if (link) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: "link",
          href: link.href
        }));
      }
    });
    true;
  })();
`;

export default function WebScreen({ route }: Props) {
  const { url, title } = route.params;
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const webRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState(title);

  // Receives messages from the injected script — the native side of the bridge.
  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "loaded" && data.title) setPageTitle(data.title);
      // A real app would route data.href to a native screen here.
    } catch {
      // ignore malformed messages
    }
  };

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      {/* Custom header */}
      <View className="flex-row items-center px-4 py-3 border-b border-line">
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={8}
          className="pr-3"
        >
          <Text className="text-ink text-lg">‹</Text>
        </Pressable>
        <Text
          numberOfLines={1}
          className="text-ink text-base font-medium flex-1"
        >
          {pageTitle}
        </Text>
      </View>

      <View className="flex-1">
        <WebView
          ref={webRef}
          source={{ uri: url }}
          injectedJavaScript={INJECTED_JS}
          onMessage={onMessage}
          onLoadEnd={() => setLoading(false)}
          startInLoadingState
          style={{ backgroundColor: COLORS.bg }}
        />
        {loading && (
          <View className="absolute inset-0 items-center justify-center bg-bg">
            <ActivityIndicator color={COLORS.accent} size="large" />
          </View>
        )}
      </View>
    </View>
  );
}
