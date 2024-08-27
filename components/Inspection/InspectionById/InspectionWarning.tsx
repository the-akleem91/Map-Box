import { Ionicons } from "@expo/vector-icons"; // Ensure you have react-native-vector-icons installed
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { INSPECTION_STATUS } from "@/libs/constants";

type Props = {
  orderStatus: INSPECTION_STATUS;
  action?: React.ReactNode;
};

const InspectionWarning = ({ orderStatus, action }: Props) => {
  if (
    [
      INSPECTION_STATUS.NO_IMAGES,
      INSPECTION_STATUS.READY_FOR_ACTION,
      INSPECTION_STATUS.PROCESSING,
    ].includes(orderStatus)
  ) {
    return (
      <View style={styles.alert}>
        {[
          INSPECTION_STATUS.NO_IMAGES,
          INSPECTION_STATUS.READY_FOR_ACTION,
        ].includes(orderStatus) ? (
          <Ionicons name="warning-outline" size={48} color="#7302A8" />
        ) : (
          <ActivityIndicator size="large" color="#7302A8" />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.alertTitle}>
            {orderStatus === INSPECTION_STATUS.NO_IMAGES
              ? "Upload Images!"
              : orderStatus === INSPECTION_STATUS.READY_FOR_ACTION
              ? "Complete your inspection!"
              : "Inspection is processing!"}
          </Text>
          <Text style={styles.alertDescription}>
            {orderStatus === INSPECTION_STATUS.NO_IMAGES
              ? `Begin by generating a measurement and weather report. To prepare a Proof-of-Loss report, please upload inspection images.`
              : orderStatus === INSPECTION_STATUS.READY_FOR_ACTION
              ? `Click 'Generate Report' to process your Measurement, Weather, and Proof-of-Loss reports.`
              : `Your reports are being generated. We will notify you once they are ready for review.`}
          </Text>
        </View>
        {action}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  alert: {
    margin: 8,
    flexDirection: "column",
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 18,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    gap: 8,
  },
  textContainer: {
    marginLeft: 16,
  },
  alertTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  alertDescription: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 4,
    color: "#808080",
  },
});

export default InspectionWarning;
