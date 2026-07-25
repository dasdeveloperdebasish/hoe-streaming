import { Text } from "react-native";

export function SectionTitle({ children }: { children: string }) {
  return (
    <Text className="text-ink text-base font-medium px-4 mb-3">{children}</Text>
  );
}
