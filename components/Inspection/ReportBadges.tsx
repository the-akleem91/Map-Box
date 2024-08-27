import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { View } from "react-native";

import type { InspectionType } from "@/types/inspection";

type Props = {
  inspection?: InspectionType;
};

export default function ReportBadges({ inspection }: Props) {
  const {
    generatedReports,
    measurementReport,
    weatherReport,
    proofOfLossReport,
  } = inspection || {};

  const data = useMemo(() => {
    const list = [
      {
        Icon: "relative-scale",
        style: { color: "#939393", backgroundColor: "#ECECEC" },
      },
      {
        Icon: "weather-hail",
        style: { color: "#939393", backgroundColor: "#ECECEC" },
      },
      {
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
    <View className="flex-row items-center gap-2">
      {data?.map((item, index) => (
        <View
          className="h-8 w-12 shrink-0 flex-col items-center justify-center rounded-full bg-red-400"
          style={{
            backgroundColor: item.style.backgroundColor,
          }}
        >
          <MaterialCommunityIcons
            key={index}
            //@ts-ignore
            name={item?.Icon}
            size={22}
            color={item.style.color}
          />
        </View>
      ))}
    </View>
  );
}
