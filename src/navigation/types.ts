import type { NavigatorScreenParams } from "@react-navigation/native";

export type HomeStackParamList = {
  HomeFeed: undefined;
  SearchHome: undefined;
  ProfileHome: undefined;
  Detail: { id: string; title: string };
  WebContent: { url: string; title: string };
};

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Search: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<RootTabParamList>;
  Player: { videoUrl: string; title: string };
};
