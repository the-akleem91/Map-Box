import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const YourComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={require("@/assets/images/image-icon.png")}
          style={styles.image}
          alt="Empty Image Icon"
        />
        <Text style={styles.heading}>
          It looks like you haven’t uploaded images yet!
        </Text>
        <Text style={styles.description}>
          Unlock powerful insights for your next property inspection by
          following these steps.
        </Text>
        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <Ionicons name="image-outline" size={30} />
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepTitle}>
                  Upload Your Inspection Images
                </Text>
              </View>
              <View>
                <Text style={styles.stepDescription}>
                  Click “Upload Images” to begin.
                </Text>
                <Text style={styles.stepDescription}>
                  You can upload as many images as you like.
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.step}>
            <Ionicons name="document-outline" size={30} />
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Generate Reports</Text>
              <Text style={styles.stepDescription}>
                After uploading, click 'Generate Reports' to create a
                Proof-of-Loss report.
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.note}>
          Please note that once image processing begins, you will not be able to
          upload additional images for this inspection.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    maxWidth: 768,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 80,
    marginBottom: 16,
    resizeMode: "contain",
    opacity: 0.75,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    paddingVertical: 16,
  },
  description: {
    fontSize: 18,
    marginBottom: 32,
    textAlign: "left",
    color: "#4B5563",
    display: "none",
  },
  stepsContainer: {
    marginBottom: 40,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  stepContent: {
    marginLeft: 16,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stepTitle: {
    fontWeight: "bold",
    color: "#4B5563",
  },
  infoIcon: {
    marginBottom: -6,
  },
  popoverText: {
    color: "#4B5563",
  },
  link: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "#6366F1",
  },
  mt2: {
    marginTop: 8,
  },
  stepDescription: {
    color: "#6B7280",
    marginTop: 4,
    fontSize: 14,
  },
  note: {
    fontSize: 13,
    marginBottom: 16,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 9999,
  },
  uploadButton: {
    backgroundColor: "#4B5563",
  },
  integrationButton: {
    backgroundColor: "#E5E7EB",
  },
  buttonText: {
    color: "white",
  },
});

export default YourComponent;
