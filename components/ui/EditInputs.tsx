import { SimpleLineIcons } from "@expo/vector-icons";
import React from "react";
import type { TextInputProps } from "react-native";
import { StyleSheet, View } from "react-native";

import Input from "./Input";

interface PencilInputProps extends TextInputProps {
  placeholder: string;
}

const EditInputs: React.FC<PencilInputProps> = ({
  placeholder,
  value,
  onChangeText,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
      <SimpleLineIcons name="pencil" size={20} style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  input: {
    paddingRight: 40, // Adjust this value to create space for the icon
  },
  icon: {
    color: "#64748B60",
    position: "absolute",
    right: 12,
    top: "30%",
  },
});

export default EditInputs;
