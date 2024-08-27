import type { AxiosError } from "axios";
import { createMutation, createQuery } from "react-query-kit";

import { axios } from "@/libs/axios";
import type { PaginatedImageType } from "@/types/image";

import { getEncodedInput } from "./utils";

export const useImageAll = createQuery<
  PaginatedImageType,
  { inspectionId: string; overviewImage?: boolean },
  AxiosError
>({
  //@ts-ignore
  queryKey: ["getAll", this?.variables?.inspectionId],
  fetcher: async (variables) => {
    const urlEncodedInput = getEncodedInput(variables);

    return axios
      .get(`/trpc/image.getAll?input=${urlEncodedInput}`)
      .then((response) => response?.data?.result?.data?.json);
  },
});

export const useGeneratePublicUrl = createQuery<string, string, AxiosError>({
  //@ts-ignore
  queryKey: ["publicUrl", this?.variables],
  fetcher: async (variables) => {
    const urlEncodedInput = getEncodedInput(variables);

    return axios
      .get(`/trpc/gcs.generatePublicBase64Url?input=${urlEncodedInput}`)
      .then((response) => response?.data?.result?.data?.json);
  },
});

export const useGenerateSignedUrl = createMutation<
  string,
  { bucketName: string; fileName: string },
  AxiosError
>({
  mutationFn: async (variables) => {
    return axios
      .post("/trpc/gcs.generateSignedUrl", JSON.stringify({ json: variables }))
      .then((response) => response?.data?.result?.data.json);
  },
});

export const useCreateImage = createMutation<
  any,
  {
    imageUrl: string;
    thumbnail: string;
    inspectionId?: string;
    mimeType: string;
    name: string;
    status: string;
  },
  AxiosError
>({
  mutationFn: async (variables) => {
    return await axios
      .post("/trpc/image.create", JSON.stringify({ json: variables }))
      .then((response) => response?.data?.result?.data.json);
  },
});
