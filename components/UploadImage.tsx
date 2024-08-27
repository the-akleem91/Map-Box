import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import * as FileSystem from "expo-file-system";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import type { Dispatch, SetStateAction } from "react";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Toast from "react-native-root-toast";

import { useCreateImage, useGenerateSignedUrl } from "@/api/useImage";
import { useUpdateInspection } from "@/api/useInspection";
import { INSPECTION_STATUS } from "@/libs/constants";
import { ErrorMessageStyle, SuccessMessageStyle } from "@/libs/ToastStyles";
import { createThumbnail } from "@/libs/utils";
import type { InspectionType } from "@/types/inspection";
import type { User } from "@/types/user";

import Button from "./ui/Button";

const MAX_IMAGES = 50;

const uploadTimeStamp = dayjs().valueOf();

type SelectedImageType = {
  fileName: string;
  assetId: string;
  uri: string;
  isUploaded: boolean;
  mimeType: string;
};

type UploadedImageType = {
  fileName?: string | undefined;
  isUploaded: boolean;
};

type Props = {
  inspection?: InspectionType;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function UploadImage({ inspection, setIsModalOpen }: Props) {
  const [selectedImages, setSelectedImages] = useState<SelectedImageType[]>([]);
  const [user, setUser] = useState<User>();

  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: GeneratePublicUrl } = useGenerateSignedUrl();
  const { mutateAsync: addImageInDB } = useCreateImage();
  const { mutateAsync: UpdateInspection, isPending } = useUpdateInspection();
  const queryClient = useQueryClient();

  const handlePickImage = async () => {
    if (selectedImages.length >= MAX_IMAGES) {
      Toast.show(
        `Maximum ${MAX_IMAGES} images can be selected`,
        ErrorMessageStyle
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((image, index) => ({
        fileName: image.fileName || "", // Ensure fileName is set
        assetId: image.assetId || `image_${Date.now()}_${index}`, // Ensure assetId is set
        uri: image.uri,
        isUploaded: false,
        mimeType: image.mimeType || "image/jpg",
      }));

      setSelectedImages((prevImages) => [...prevImages, ...newImages]);
    }
  };
  const handleRemoveImage = (assetId: string) => {
    setSelectedImages((prevState) =>
      prevState.filter((image) => image.assetId !== assetId || image.isUploaded)
    );
  };

  const updateUploadStatus = (assetId: string, status: boolean) => {
    setSelectedImages((prevImages) =>
      prevImages.map((image) =>
        image.assetId === assetId ? { ...image, isUploaded: status } : image
      )
    );
  };

  async function handleSubmit() {
    const imageUploaded = selectedImages.filter(
      (item) => item.isUploaded === true
    );

    try {
      setIsLoading(true);
      await UpdateInspection(
        {
          id: inspection?.id || "",
          status: INSPECTION_STATUS.READY_FOR_ACTION,
          imageCount: imageUploaded?.length + (inspection?.imageCount || 0),
        },
        {
          onSuccess() {
            queryClient.invalidateQueries({
              queryKey: ["inspections", inspection?.id],
            });
            Toast.show("Images uploaded Sucussfully", SuccessMessageStyle);
            queryClient.invalidateQueries({ queryKey: ["getAll"] });
          },
        }
      );
      setSelectedImages([]);
    } catch {
      Toast.show(
        "Something went wrong, our team has been notified!",
        ErrorMessageStyle
      );
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  }

  async function uploadToGCS(file: SelectedImageType) {
    const name = file.fileName;
    const lastIndex = name.lastIndexOf(".");
    const fileName = name.substring(0, lastIndex);
    const extension = name.substring(lastIndex + 1);

    const orgId = user?.roles[0].id;

    const filePath = `${
      process.env.NEXT_PUBLIC_MODE === "staging" ? "staging_" : ""
    }${orgId}/${inspection?.id}/${uploadTimeStamp}/${fileName}.${extension}`;

    const bucketName =
      process.env.NODE_ENV === "production"
        ? "granular-rasters"
        : "test_bucket_create";

    return GeneratePublicUrl({
      bucketName: bucketName,
      fileName: filePath,
    })
      .then(async (imageUrl) => {
        const signedUrl = imageUrl;
        const fileUri = file.uri; // Replace with your local file URI

        const uploadResult = await FileSystem.uploadAsync(signedUrl, fileUri, {
          httpMethod: "PUT",
          headers: {
            "Content-Type": "image/*",
          },
        });

        if (uploadResult.status === 200) {
          const inspectionId = inspection?.id;

          const thumbnail = await createThumbnail(file.uri);

          if (thumbnail) {
            addImageInDB({
              imageUrl: `gs://${bucketName}/${filePath}`,
              thumbnail: thumbnail,
              inspectionId,
              mimeType: file.mimeType,
              name: file.fileName,
              status: "ready",
            });

            updateUploadStatus(file.assetId, true);
          } else {
            updateUploadStatus(file.assetId, false);
          }
        }
      })
      .catch((error) => {
        Toast.show(error.message, ErrorMessageStyle);
        updateUploadStatus(file.assetId, false);
        console.log(error.message);
      });
  }

  async function handleUpload() {
    try {
      setIsUploading(true);
      if (selectedImages?.length) {
        if (inspection?.id) {
          const ImagesToUpload = selectedImages.filter(
            (image) => image?.isUploaded === false
          );

          const uploadPromises = ImagesToUpload.map(async (file) => {
            if (["image/heic", "image/heif"].includes(file.mimeType)) {
              const convertedImage = await manipulateAsync(file.uri, [], {
                compress: 0.9,
                format: SaveFormat.JPEG,
              });
              const newFile = {
                ...file,
                uri: convertedImage.uri,
                mimeType: "image/jpeg",
              };
              await uploadToGCS(newFile);
            } else {
              await uploadToGCS(file);
            }
          });

          await Promise.all(uploadPromises);
        }
      }
    } catch (error) {
      Toast.show("Images Not uploaded");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <View className="flex h-full ">
      <View className="mt-8 gap-4 ">
        <Text className="mb-2 text-lg font-medium">Upload File</Text>
        <Text className="mb-2 text-gray-500">
          Feel free to upload up to 50 images in one go, and there's no limit to
          the total number you can upload. After you've uploaded all your
          images, please proceed by clicking Submit Inspection to initiate the
          analysis.
        </Text>
        <Pressable
          onPress={handlePickImage}
          className="mt-2  items-center justify-center gap-2 rounded-lg bg-[#ECF0F6] p-8"
        >
          <Ionicons name="cloud-upload-outline" size={56} />
          <Text className="text-base font-medium">Upload Image</Text>
          <Text className="text-center text-gray-500">
            Select images by clicking to initiate the upload.
          </Text>
        </Pressable>
      </View>
      <View className="flex-1">
        <View className="flex-1">
          {selectedImages.length !== 0 && (
            <View className="flex-1">
              <Text className="my-4 text-lg font-medium">Images</Text>
              <ScrollView className="flex-1">
                {selectedImages.map((image, ind) => (
                  <View
                    key={ind}
                    className="mb-4 flex-row items-center gap-4 rounded-md border border-gray-200 p-2"
                  >
                    <FontAwesome6 name="file-image" size={28} />
                    <Text className="grow text-base">{image.fileName}</Text>
                    <Text
                      className="font-serif text-xs italic"
                      style={{
                        color: image.isUploaded ? "green" : "red",
                      }}
                    >
                      {image.isUploaded ? "Uploaded" : "Pending"}
                    </Text>
                    {!image?.isUploaded && (
                      <MaterialCommunityIcons
                        name="delete-outline"
                        size={28}
                        color={"#ef4444"}
                        onPress={() => handleRemoveImage(image.assetId)}
                        disabled={image.isUploaded}
                      />
                    )}
                  </View>
                ))}
              </ScrollView>
              <View className="flex-row gap-4">
                <Button
                  title="Upload"
                  className="flex-1 rounded-full"
                  variant="outline"
                  disabled={isUploading}
                  isLoading={isUploading}
                  onPress={handleUpload}
                />
                <Button
                  title="Done"
                  className="flex-1 rounded-full"
                  isLoading={isLoading}
                  onPress={handleSubmit}
                  disabled={
                    selectedImages.some((image) => !image.isUploaded) ||
                    isLoading
                  }
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
