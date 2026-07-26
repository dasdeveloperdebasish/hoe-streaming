import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "./types";
import ProfileScreen from "@/screens/profile/ProfileScreen";
import DetailScreen from "@/screens/detail/DetailScreen";
import WebScreen from "@/screens/web/WebScreen";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="WebContent" component={WebScreen} />
    </Stack.Navigator>
  );
}
