import { Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "@/navigation/types";

type Props = NativeStackScreenProps<HomeStackParamList, "Detail">;

export default function DetailScreen({ route }: Props) {
  const { title } = route.params;
  return (
    <View className="flex-1 bg-bg items-center justify-center">
      <Text className="text-ink text-2xl font-medium">{title}</Text>
    </View>
  );
}
