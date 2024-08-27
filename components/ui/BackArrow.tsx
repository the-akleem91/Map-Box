import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

export default function BackArrow() {
  return (
    <Pressable onPress={() => router.push("/")}>
      <AntDesign name="arrowleft" size={24} className="ml-4 mr-2  shrink-0 " />
    </Pressable>
  );
}
