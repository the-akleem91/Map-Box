import { Ionicons } from "@expo/vector-icons"; // Ensure you have react-native-vector-icons installed
import axios from "axios";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import Toast from "react-native-root-toast";

import { DEFAULT_DATE_FORMAT_WITH_TIME } from "@/libs/constants";
import type { InspectionType, ReportType } from "@/types/inspection";
import type { ReportItem } from "@/types/Report";

const reports: Array<ReportItem> = [
  {
    title: "Measurement Report",
    description: "Human labeled and expert reviewed roof measurements.",
    Icon: "ruler", // Use appropriate icons from Ionicons
  },
  {
    title: "Weather Report",
    description: "Historical storms that have impacted the property.",
    Icon: "ios-cloudy-night",
  },
  {
    title: "Proof-of-Loss Report",
    description: "Storm damage evidence presented by slope.",
    Icon: "ios-home",
  },
  {
    title: "Custom Report",
    description: "Specialized report requested by user.",
    Icon: "ios-build",
  },
];

const reportMapping: Record<string, keyof InspectionType> = {
  "Measurement Report": "measurementReport",
  "Weather Report": "weatherReport",
  "Proof-of-Loss Report": "proofOfLossReport",
  "Custom Report": "customReport",
};

type Props = { inspection?: InspectionType };

const ReportsTab = ({ inspection }: Props) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  const data = useMemo(() => {
    if (
      inspection?.measurementReport ||
      inspection?.weatherReport ||
      inspection?.proofOfLossReport
    ) {
      return reports.map((report) => {
        const foundReport = inspection[
          reportMapping?.[report?.title]
        ] as ReportType;
        if (foundReport && foundReport.verified) {
          return {
            ...report,
            fileName: foundReport.name,
            fileUrl: foundReport.url || foundReport.privateUrl,
            createdAt: dayjs(foundReport.createdAt).format(
              DEFAULT_DATE_FORMAT_WITH_TIME
            ),
          };
        }
        return report;
      });
    }
    return reports;
  }, [inspection]);

  const downloadFile = async (url: string, name: string) => {
    try {
      setIsDownloading(true);
      const response = await axios.get(url, { responseType: "blob" });

      ToastAndroid.show("Download successful", ToastAndroid.SHORT);
      setIsDownloading(false);
    } catch (error) {
      setIsDownloading(false);
      Alert.alert(
        "Error",
        "Something went wrong while downloading the report. Please contact the team."
      );
      console.error("Error downloading report:", error);
    }
  };

  const handleDownload = (report?: ReportItem) => {
    console.log(report);
    if (report?.fileUrl?.includes("gs://")) {
      axios
        .post(
          "https://inspect.properties/api/convert-private-url-to-file",
          { url: report.fileUrl },
          { responseType: "blob" }
        )
        .then((res) => {
          downloadFile(res.data, `${report.fileName || report.title}.pdf`);
        })
        .catch((error) => {
          setIsDownloading(false);
          Toast.show("Error");
          console.error("Error downloading report:", error);
        });
    } else if (report?.fileUrl) {
      downloadFile(report?.fileUrl, `${report?.fileName || report?.title}.pdf`);
    }
  };

  return (
    <View className="pb-8">
      <Text className="mt-t py-4 text-2xl font-medium">Reports</Text>
      {data.map((report, index) => (
        <View
          key={index}
          className="m-[1px] flex-row items-center bg-white p-4 my-2 rounded-lg gap-1 border border-gray-300"
        >
          <View className="flex-1 gap-1">
            <Text className="text-lg font-bold">{report.title}</Text>
            <Text className="text-sm text-gray-700">{report.description}</Text>
            {report.createdAt && (
              <Text className="text-xs text-gray-500">{report.createdAt}</Text>
            )}
            {!report.fileUrl && (
              <Text className="mt-1 text-xs text-gray-400">
                This Report is not available yet, We will notify you when it is
                ready.
              </Text>
            )}
          </View>
          <Pressable
            onPress={() => handleDownload(report)}
            disabled={!report?.fileUrl}
          >
            <Ionicons name="download-outline" size={28} color="#4F46E5" />
          </Pressable>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 16,
  },

  description: {
    fontSize: 14,
    color: "#666",
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    marginLeft: 8,
  },
});

export default ReportsTab;
