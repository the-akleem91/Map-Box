import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Text, View } from "react-native";

import type { InspectionType } from "@/types/inspection";

type Props = {
  inspection?: InspectionType;
};
export default function InspectionStatus({ inspection }: Props) {
  const {
    generatedReports,
    measurementReport,
    weatherReport,
    proofOfLossReport,
  } = inspection || {};

  const data = useMemo(() => {
    const list = [
      {
        Report: "Measurement Report",
        Icon: "relative-scale",
        style: { color: "#939393", backgroundColor: "#ECECEC" },
      },
      {
        Report: "Weather Report",
        Icon: "weather-hail",
        style: { color: "#939393", backgroundColor: "#ECECEC" },
      },
      {
        Report: "Proof-Of-Loss Report",
        Icon: "home-alert-outline",
        style: { color: "#939393", backgroundColor: "#ECECEC" },
      },
    ];

    if (!generatedReports) return list;

    // Pending condition
    if (
      generatedReports?.includes("Measurements Report") &&
      !measurementReport?.verified
    ) {
      list[0].style = { color: "#2870DD", backgroundColor: "#2870DD19" };
    }

    if (
      generatedReports?.includes("Weather Report") &&
      !weatherReport?.verified
    ) {
      list[1].style = { color: "#2870DD", backgroundColor: "#2870DD19" };
    }

    if (
      generatedReports?.includes("Proof-of-loss Report") &&
      !proofOfLossReport?.verified
    ) {
      list[2].style = { color: "#2870DD", backgroundColor: "#2870DD19" };
    }

    // Report ready condition
    if (measurementReport?.verified) {
      list[0].style = { color: "#2BB050", backgroundColor: "#2BB05019" };
    }

    if (weatherReport?.verified) {
      list[1].style = { color: "#2BB050", backgroundColor: "#2BB05019" };
    }
    if (proofOfLossReport?.verified) {
      list[2].style = { color: "#2BB050", backgroundColor: "#2BB05019" };
    }

    return list;
  }, [generatedReports, measurementReport, weatherReport, proofOfLossReport]);

  return (
    <View>
      <View className="flex-row items-center justify-between gap-2">
        {data?.map((item, index) => (
          <View
            key={index}
            className="h-24 w-[32%] items-center justify-center gap-1 rounded-lg px-5"
            style={{
              backgroundColor: item.style.backgroundColor,
            }}
          >
            <MaterialCommunityIcons
              //@ts-ignore
              name={item?.Icon}
              size={32}
              color={item.style.color}
              className="shrink-0"
            />
            <View className="text-red-500">
              <Text className="flex-wrap text-center text-xs">
                {item.Report}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
