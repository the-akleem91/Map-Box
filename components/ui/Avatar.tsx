import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { useSession } from "@/contexts/authProvider";

type Props = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Avatar({ setIsOpen }: Props) {
  const { session } = useSession();

  return (
    <View className="relative">
      <Pressable
        className="size-11 items-center justify-center rounded-full bg-gray-200"
        onPress={() => setIsOpen((prevState) => !prevState)}
      >
        {session?.avatar ? (
          <Image
            source={{ uri: session?.avatar }}
            style={{ height: 44, width: 44, borderRadius: 999 }}
          />
        ) : (
          <Text className="text-lg font-medium">{session?.firstName[0]}</Text>
        )}
      </Pressable>
    </View>
  );
}
