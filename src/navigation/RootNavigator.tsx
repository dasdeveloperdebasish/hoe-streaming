import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";
import RootTabs from "./RootTabs";
import PlayerScreen from "@/screens/player/PlayerScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={RootTabs} />
      <Stack.Screen
        name="Player"
        component={PlayerScreen}
        options={{ presentation: "fullScreenModal", animation: "fade" }}
      />
    </Stack.Navigator>
  );
}
