import React from "react";
import { Text } from "react-native";

type props = {
  message: string;
};
export default function ErrorMessage({ message }: props) {
  return <Text className="ml-0.5 mt-1 text-sm text-red-600">{message}</Text>;
}
