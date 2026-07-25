import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { RootTabParamList } from "./types";
import HomeStack from "./HomeStack";
import SearchScreen from "@/screens/home/SearchScreen";
import ProfileScreen from "@/screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF5A36",
        tabBarInactiveTintColor: "#8B8B93",
        tabBarStyle: {
          backgroundColor: "#0A0A0B",
          borderTopColor: "#26262C",
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
