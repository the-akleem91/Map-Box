import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useGestureHandler } from "@/app/_layout";

type Props = {
  perPage: number;
  setPerPage: React.Dispatch<React.SetStateAction<number>>;
};

export default function Select({
  perPage: selectedValue,
  setPerPage: setSelectedValue,
}: Props) {
  const options = [10, 20, 30, 40, 50];

  const handleSelect = (value: number) => {
    setIsOpen(true);
    setSelectedValue(value);
    setIsOpen(false);
  };

  const { isOpen, setIsOpen } = useGestureHandler();

  return (
    <View style={{ position: "relative" }}>
      {isOpen && (
        <View
          className="absolute top-[-200px] z-50 w-24 rounded-lg border border-gray-200 
        bg-white px-2 py-4"
        >
          {options.map((option) => (
            <Pressable
              key={option}
              onPress={() => handleSelect(option)}
              className={`flex-row items-center justify-between px-4 py-2 ${
                option === selectedValue ? "rounded-lg bg-blue-100" : ""
              }`}
            >
              <Text>{option}</Text>
              {option === selectedValue && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color="blue"
                  style={{ marginLeft: 8 }}
                />
              )}
            </Pressable>
          ))}
        </View>
      )}
      <Pressable
        className="flex-row items-center justify-between gap-1 rounded-lg border border-gray-200 bg-white px-4 py-3"
        //@ts-ignore
        onPress={() => setIsOpen((prev) => !prev)}
      >
        <Text>{selectedValue}</Text>
        <Ionicons name="chevron-down-outline" size={14} />
      </Pressable>
    </View>
  );
}
