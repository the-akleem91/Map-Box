import { MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import * as FileSystem from "expo-file-system";
import { useGlobalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StyleSheet } from "react-native";
import Toast from "react-native-root-toast";
import PDFReader from "rn-pdf-reader-js";

import { useInspection } from "@/api/useInspection";
import ModalComponent from "@/components/ui/Modal";
import { axios } from "@/libs/axios";
import { DEFAULT_DATE_FORMAT_WITH_TIME } from "@/libs/constants";
import { SuccessMessageStyle } from "@/libs/ToastStyles";
import type { InspectionType, ReportType } from "@/types/inspection";
import type { ReportItem } from "@/types/Report";

const reports: Array<ReportItem> = [
  {
    title: "Measurement Report",
    description: "Human labeled and expert reviewed roof measurements.",
    Icon: (
      <MaterialCommunityIcons name="relative-scale" size={36} color="#4b5563" />
    ),
  },
  {
    title: "Weather Report",
    description: "Historical storms that have impacted the property.",
    Icon: (
      <MaterialCommunityIcons name="weather-hail" size={36} color="#4b5563" />
    ),
  },
  {
    title: "Proof-of-Loss Report",
    description: "Storm damage evidence presented by slope.",
    Icon: (
      <MaterialCommunityIcons
        name="home-alert-outline"
        size={36}
        color="#4b5563"
      />
    ),
  },
];

const reportMapping: Record<string, keyof InspectionType> = {
  "Measurement Report": "measurementReport",
  "Weather Report": "weatherReport",
  "Proof-of-Loss Report": "proofOfLossReport",
  "Custom Report": "customReport",
};

const ReportsTab = () => {
  const { inspectionId } = useGlobalSearchParams();
  const { data: inspection, isPending: isLoading } = useInspection({
    variables: {
      id: inspectionId as string,
    },
  });
  const [base64, setbase64] = useState("");
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [isModlalOpen, setIsModalOpen] = useState(false);

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

  async function saveFile(uri: string, filename: string, mimetype: string) {
    if (Platform.OS === "android") {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          filename,
          mimetype
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
            Toast.show("Report Downloaded", SuccessMessageStyle);
          })
          .catch((e) => console.log(e));
      } else {
        Sharing.shareAsync(uri);
      }
    } else {
      Sharing.shareAsync(uri);
    }
  }

  const handleDownload = async (report?: ReportItem) => {
    if (report?.fileUrl?.includes("gs://")) {
      try {
        setIsDownloading(report.title);
        const res = await axios.post(
          `/convert-private-url-to-file`,
          {
            url: report?.fileUrl,
          },
          {
            responseType: "blob",
          }
        );
        const blob = res.data;
        const reader = new FileReader();

        reader.onloadend = async () => {
          const base64data = reader.result as string;
          const fileName = `${report?.fileName || report?.title}.pdf`;
          const fileUri = `${FileSystem.documentDirectory}${fileName}`;
          await FileSystem.writeAsStringAsync(
            fileUri,
            base64data.split(",")[1],
            {
              encoding: FileSystem.EncodingType.Base64,
            }
          );
          setIsDownloading(null);
          saveFile(fileUri, fileName, "application/pdf");
        };

        reader.readAsDataURL(blob);
      } catch (error: any) {
        console.log(error.message);
      }
    } else if (report?.fileUrl) {
      // downloadFile(report?.fileUrl, `${report?.fileName || report?.title}.pdf`);
    }
  };

  const handleView = async (report?: ReportItem) => {
    if (report?.fileUrl?.includes("gs://")) {
      try {
        const res = await axios.post(
          `/convert-private-url-to-file`,
          {
            url: report?.fileUrl,
          },
          {
            responseType: "blob",
          }
        );
        const blob = res.data;
        const reader = new FileReader();

        reader.onloadend = async () => {
          const base64data = reader.result as string;
          setbase64(base64data);
        };
      } catch (error: any) {
        console.log(error.message);
      }
    }
  };

  if (isLoading) {
    return (
      <ActivityIndicator
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        size="large"
        color={"#4F46E5"}
      />
    );
  }
  return (
    <ScrollView className="px-4 pb-10">
      {data.map((report, index) => (
        <View
          key={index}
          className="my-2 rounded-lg border border-gray-200 bg-white p-4"
        >
          <Text className="mb-1">{report.Icon}</Text>
          <View className="flex-row items-center">
            <View className="flex-1 gap-2">
              <Text className="text-xl font-medium">{report.title}</Text>
              <Text className="text-gray-500">{report.description}</Text>
              <Text className="text-sm">{report?.fileName}</Text>
              {report.createdAt && (
                <Text className="text-sm text-gray-400">
                  {report.createdAt}
                </Text>
              )}
            </View>
          </View>
          {report?.fileUrl ? (
            <View className="mt-2 flex-row">
              <Pressable
                className="mr-2 items-center justify-center rounded-full bg-primary px-4 py-1"
                onPress={() => handleDownload(report)}
              >
                <Text style={{ color: "white" }}>
                  {isDownloading === report.title
                    ? "Downloading..."
                    : "Download"}
                </Text>
              </Pressable>
              {/* <Pressable
                className="mr-2 items-center justify-center rounded-full bg-primary px-4 py-1"
                onPress={() => handleView(report)}
              >
                <Text style={{ color: "white" }}>
                  {isDownloading ? "Opening" : "View"}
                </Text>
              </Pressable> */}
            </View>
          ) : (
            <Text style={{ fontSize: 12, color: "#808080" }}>
              This Report is not available yet, We will notify you when it is
              ready.
            </Text>
          )}
        </View>
      ))}

      <ModalComponent
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModlalOpen}
      >
        <View style={styles.container}>
          {base64 && (
            <PDFReader
              source={{
                base64: base64,
              }}
            />
          )}
        </View>
      </ModalComponent>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: 400,
    height: "100%",
  },
});

export default ReportsTab;
