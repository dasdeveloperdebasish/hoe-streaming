import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { RootTabParamList } from "./types";
import { COLORS } from "@/constants/theme";
import HomeStack from "./HomeStack";
import SearchStack from "./SearchStack";
import ProfileScreen from "@/screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarStyle: {
          backgroundColor: COLORS.bg,
          borderTopColor: COLORS.line,
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Search" component={SearchStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
