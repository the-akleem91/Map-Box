import type { ReactNode } from "react";
import React, { useRef } from "react";
import type { TextInputProps } from "react-native";
import { TextInput, View } from "react-native";

type props = {
  placeholder: string;
  disabled?: boolean;
  children?: ReactNode;
} & TextInputProps;
function Input({ placeholder, disabled, children, ...rest }: props) {
  const inputRef = useRef<TextInput>(null);

  const handleFocus = () => {
    if (inputRef.current) {
      // Move the cursor to the start position
      inputRef.current.setNativeProps({ selection: { start: 0, end: 0 } });
    }
  };
  return (
    <View>
      <TextInput
        ref={inputRef}
        cursorColor={"#4F46E5"}
        placeholderTextColor={"#6c757d"}
        selectionColor="rgba(79, 70, 229, 0.4)"
        placeholder={placeholder}
        editable={!disabled}
        style={{
          backgroundColor: "#e9ecef",
          opacity: 0.7,
          color: "black",
          padding: 12,
          borderRadius: 12,
          fontSize: 16,
          fontWeight: "semibold",
        }}
        {...rest}
        onFocus={handleFocus}
      >
        {children}
      </TextInput>
    </View>
  );
}

export default Input;
