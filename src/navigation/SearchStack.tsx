import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "./types";
import SearchScreen from "@/screens/home/SearchScreen";
import DetailScreen from "@/screens/detail/DetailScreen";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchHome" component={SearchScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
}
