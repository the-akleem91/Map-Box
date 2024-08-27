import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";
import { type ClassValue, clsx } from "clsx";
import * as FileSystem from "expo-file-system";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { twMerge } from "tailwind-merge";

import { MAPBOX_ACCESS_TOKEN } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUserToken = async () => {
  const value = await AsyncStorage.getItem("userToken");
  const userToken = value && JSON.parse(value);
  return userToken;
};

export const getMimeType = (fileName: string) => {
  const fileExtension = fileName.split(".").pop();
  return `image/${fileExtension}`;
};

export const createThumbnail = async (imageUri: string) => {
  const compressImage = await manipulateAsync(
    imageUri,
    [{ resize: { width: 100, height: 75 } }],
    { compress: 0.9, format: SaveFormat.JPEG }
  );
  const base64 = await FileSystem.readAsStringAsync(compressImage.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (base64) return `data:image/jpeg;base64,${base64}`;
  else return null;
};

export const getMapboxStaticImage = (
  bbox?: number[],
  padding?: number[],
  width?: number,
  height?: number
) => {
  if (bbox) {
    return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/[${bbox}]/${
      width || "500"
    }x${height || "500"}@2x?padding=${
      padding || "50,10,20"
    }&access_token=${MAPBOX_ACCESS_TOKEN}`;
  }
};

export const convertBinaryToBase64 = (binary: any, mimeType?: string) => {
  if (!binary || !mimeType) return "";

  // console.log(binary);

  // Assuming binary.data is the array of bytes
  const byteArray = Uint8Array.from(binary.data);
  const base64Image = Buffer.from(byteArray).toString("base64");

  const base64 = `data:${mimeType};base64,${base64Image}`;
  return base64.replace("dataimage/jpegbase64", "");
};

export const getDetailedAddress = (address?: string) => {
  if (!address || typeof address !== "string") return {};

  const propertyAddress = address?.split(",");
  const propertyStreet = propertyAddress ? propertyAddress[0] : "";
  const cityAndZipCode = propertyAddress
    ?.slice(1, propertyAddress.length)
    .filter((item: string) => item !== " United States")
    .join(", ");

  return {
    propertyStreet,
    cityAndZipCode,
  };
};

export const getPrimaryOrg = (roles?: Array<{ id: string; role: string }>) => {
  if (!Array.isArray(roles) || roles?.length === 0) return null;

  const foundOwnerOrg = roles?.find((item) => item.role === "owner");
  const foundAdminOrg = roles?.find((item) => item.role === "admin");

  const foundOrg = foundOwnerOrg || foundAdminOrg;

  if (!foundOrg) return null;

  return foundOrg;
};
