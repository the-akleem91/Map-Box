import React from "react";
import { Text } from "react-native";

type props = {
  label: string;
};
function Label({ label }: props) {
  return <Text style={{ color: "#64748B", marginBottom: 8 }}>{label}</Text>;
}

export default Label;
