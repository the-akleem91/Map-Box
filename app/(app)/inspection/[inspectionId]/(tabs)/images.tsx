import { router, useGlobalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import { useImageAll } from "@/api/useImage";
import { useInspection } from "@/api/useInspection";
import EmpryImageMessage from "@/components/Inspection/InspectionById/ImagesTab/ImagePlaceholder";
import PreviewImages from "@/components/Inspection/InspectionById/ImagesTab/PreviewImages";
import Button from "@/components/ui/Button";
import ModalComponent from "@/components/ui/Modal";
import UploadImage from "@/components/UploadImage";

export default function Images() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { inspectionId } = useGlobalSearchParams();

  const { data: inspection, isPending: isLoading } = useInspection({
    variables: {
      id: inspectionId as string,
    },
  });

  const { data, isPending } = useImageAll({
    variables: {
      inspectionId: inspectionId as string,
    },
  });

  const uploadImages = data?.results;

  if (isLoading || isPending) {
    return (
      <ActivityIndicator
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        size="large"
        color={"#4F46E5"}
      />
    );
  }

  const hasDroneImages =
    (!!inspection?.imageCount && inspection?.imageCount > 0) ||
    uploadImages?.some((image) => !image.satelliteImage);

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      {hasDroneImages ? (
        <PreviewImages images={uploadImages} />
      ) : (
        <EmpryImageMessage />
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Upload Image"
          variant="outline"
          onPress={() => setIsModalOpen(true)}
        />

        <ModalComponent
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        >
          <UploadImage
            inspection={inspection}
            setIsModalOpen={setIsModalOpen}
          />
        </ModalComponent>

        {uploadImages?.length !== 0 && (
          <Button
            title="Generate Report"
            onPress={() =>
              router.push(`/inspection/${inspectionId}/orderReport`)
            }
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  buttonContainer: {
    marginBottom: 16,
    marginTop: "auto",
  },
});
