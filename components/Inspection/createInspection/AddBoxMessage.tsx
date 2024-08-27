import { View, Text } from "react-native";
import React from "react";

export default function AddBoxMessage() {
  return (
    <View className="absolute z-50 top-2 left-2 bg-white px-6 py-4 rounded-lg w-4/5">
      <Text className="text-lg font-medium text-primary">
        Confirm Property!
      </Text>
      <Text className="text-gray-500 text-sm">
        Select you structure within the property by clicking on polygon or
        drawing a rectangle. by clicking on polygon icon.
      </Text>
    </View>
  );
}
