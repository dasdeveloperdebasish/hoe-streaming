import type { NavigatorScreenParams } from "@react-navigation/native";

export type HomeStackParamList = {
  HomeFeed: undefined;
  SearchHome: undefined;
  Detail: { id: string; title: string };
  WebContent: { url: string; title: string };
  Player: { videoUrl: string; title: string };
};

// The three bottom tabs.
export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Search: undefined;
  Profile: undefined;
};
