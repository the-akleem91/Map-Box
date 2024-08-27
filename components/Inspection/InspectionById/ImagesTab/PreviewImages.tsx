import { Image } from "expo-image";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { convertBinaryToBase64 } from "@/libs/utils";
import type { ImageType } from "@/types/image";

type Props = {
  images?: Array<ImageType>;
};

export default function PreviewImages({ images }: Props) {
  return (
    <View>
      {/* <Input
        className="rounded-md border border-gray-300 px-4 py-2 "
        placeholder="Search Image"
      /> */}
      <ScrollView className="mt-4 h-[65%]">
        <View className="justsify-between w-full flex-1 flex-row flex-wrap items-center gap-4 py-2">
          {images?.map((image: ImageType, index: number) => {
            const imageUrl = convertBinaryToBase64(
              image.thumbnail,
              image?.mimeType
            );

            return (
              <View key={index}>
                <Image
                  source={{
                    uri:
                      imageUrl ||
                      require("@/assets/images/image-placeholder.png"),
                  }}
                  style={styles.image}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  imagePreviewContainer: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    flexDirection: "row",
    width: "100%",
  },
  image: {
    width: 90,
    height: 90,
    resizeMode: "cover",
    borderRadius: 6,
  },
});
