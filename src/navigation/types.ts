import type { NavigatorScreenParams } from "@react-navigation/native";

// Screens inside the Home stack, and what params each needs.
export type HomeStackParamList = {
  HomeFeed: undefined; // no params
  Detail: { id: string; title: string }; // needs a content id
  WebContent: { url: string; title: string };
};

// The three bottom tabs.
export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Search: undefined;
  Profile: undefined;
};
