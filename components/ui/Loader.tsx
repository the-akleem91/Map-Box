import React from "react";
import { ActivityIndicator } from "react-native";

export default function Loader() {
  return (
    <ActivityIndicator
      className="flex-1 items-center justify-center text-primary"
      size="large"
      color={"white"}
    />
  );
}
