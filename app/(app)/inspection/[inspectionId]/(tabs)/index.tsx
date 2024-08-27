import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
import utc from "dayjs/plugin/utc";
import { Image } from "expo-image";
import { router, useGlobalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useGeneratePublicUrl, useImageAll } from "@/api/useImage";
import { useInspection } from "@/api/useInspection";
import InspectionStatus from "@/components/Inspection/InspectionById/InspectionStatus";
import Button from "@/components/ui/Button";
import { DEFAULT_DATE_FORMAT } from "@/libs/constants";
import { getDetailedAddress, getMapboxStaticImage } from "@/libs/utils";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function InspectionOverView() {
  const { inspectionId } = useGlobalSearchParams();

  const { data: inspection, isPending: isLoading } = useInspection({
    variables: {
      id: inspectionId as string,
    },
  });

  const { data: overviewImages, isLoading: isOverviewImageLoading } =
    useImageAll({
      variables: {
        inspectionId: inspectionId as string,
        overviewImage: true,
      },
    });

  const overviewImage = overviewImages?.results[0]?.imageUrl;

  const { data: overviewImagePublicUrl, isLoading: isPublicUrlGenerating } =
    useGeneratePublicUrl({
      variables: overviewImage as string,
      enabled: !!overviewImage,
    });

  const { property, inspectionDate } = inspection || {};
  const structure = property?.structures?.find(
    (structure) => structure.id === inspection?.structureId
  );
  const { name, propertyType, bbox } = structure || {};
  const address = inspection?.property.address;
  const { cityAndZipCode, propertyStreet } = getDetailedAddress(address);

  const mapboxStaticImage = getMapboxStaticImage(bbox, [50, 50, 50], 800, 400);

  if (isOverviewImageLoading || isPublicUrlGenerating) {
    return (
      <ActivityIndicator
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        size="large"
        color={"#4F46E5"}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View>
        <InspectionStatus inspection={inspection} />
      </View>

      <View className="flex-col gap-5">
        {mapboxStaticImage || overviewImagePublicUrl ? (
          <Image
            style={styles.image}
            source={{
              uri: overviewImagePublicUrl || mapboxStaticImage,
            }}
          />
        ) : (
          <Image
            className="h-14 w-full"
            source={require("@/assets/images/image-placeholder.png")}
          />
        )}
      </View>

      <View className="flex-1 flex-wrap py-2">
        <View>
          <Text className="text-xl font-semibold">{propertyStreet}</Text>
          <Text className="text-left text-gray-500">{cityAndZipCode}</Text>
        </View>
      </View>
      <View className="flex-row justify-between">
        <View>
          <Text className="text-base text-gray-600">Structure</Text>
          <Text className=" text-lg font-medium">{name || ""}</Text>
        </View>
        <View>
          <Text className="text-base text-gray-600">Property Type</Text>
          <Text className=" text-lg font-medium">
            {propertyType ?? "Residential"}
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-row justify-between">
        <View>
          <Text className="text-base text-gray-600">Inspection Date</Text>
          <Text className=" text-lg font-medium">
            {dayjs
              .utc(inspectionDate ?? inspection?.createdAt)
              .local()
              .format(DEFAULT_DATE_FORMAT)}
          </Text>
        </View>
        <View>
          <Text className="text-base text-gray-600">Date of Loss</Text>
          <Text className="text-lg font-medium">-</Text>
        </View>
      </View>
      <View>
        <Button
          title="Generate Report"
          onPress={() => router.push(`/inspection/${inspectionId}/orderReport`)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    gap: 24,
    paddingBottom: 32,
  },

  image: {
    width: "100%",
    height: 220,
    backgroundColor: "#808080",
    borderRadius: 12,
  },

  placeholderImage: {
    width: "100%",
    height: 220,
    backgroundColor: "#808080",
    borderRadius: 12,
  },
});
