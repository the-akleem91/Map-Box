import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { commonContainer } from "@/libs/commonStyles";

type Props = {
  children: React.JSX.Element;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ModalComponent({
  children,
  isModalOpen,
  setIsModalOpen,
}: Props) {
  return (
    <Modal visible={isModalOpen} animationType="slide">
      <SafeAreaView
        className="mx-4 flex-1 pt-5"
        style={{ ...commonContainer.container, flex: 1 }}
      >
        <Pressable
          style={styles.backButton}
          onPress={() => setIsModalOpen(false)}
        >
          <Ionicons name="arrow-back" size={24} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <View style={{ flex: 1 }}>{children}</View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backText: {
    fontSize: 18,
  },
});
