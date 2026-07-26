import { memo } from "react";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import type { CastMember } from "@/types/content";
import { COLORS } from "@/constants/theme";

const BLUR = "L6PZfSi_.AyE_3t7t7R**0o#DgR4";

function CastCardBase({ member }: { member: CastMember }) {
  return (
    <View className="mr-4 items-center" style={{ width: 72 }}>
      <Image
        source={member.photoUrl}
        placeholder={{ blurhash: BLUR }}
        contentFit="cover"
        transition={150}
        cachePolicy="memory-disk"
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: COLORS.surface,
        }}
      />
      <Text numberOfLines={1} className="text-ink text-xs mt-2 text-center">
        {member.name}
      </Text>
      <Text numberOfLines={1} className="text-muted text-[10px] text-center">
        {member.role}
      </Text>
    </View>
  );
}

export const CastCard = memo(CastCardBase);
