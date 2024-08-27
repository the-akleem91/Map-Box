import type { AxiosError } from "axios";
import { createMutation, createQuery } from "react-query-kit";

import { axios } from "@/libs/axios";
import { INSPECTION_STATUS } from "@/libs/constants";
import type { InspectionType } from "@/types/inspection";
import type { PaginatedResults } from "@/types/pagination";

import { getEncodedInput } from "./utils";

export const useInspection = createQuery<
  InspectionType,
  { id: string },
  AxiosError
>({
  //@ts-ignore
  queryKey: ["inspection", this?.variables],
  fetcher: async (variables) => {
    const urlEncodedInput = getEncodedInput(variables.id);

    return axios
      .get(`/trpc/inspection.getById?input=${urlEncodedInput}`)
      .then((response) => response?.data?.result?.data?.json);
  },
});

export const useInspections = createQuery<
  PaginatedResults<InspectionType>,
  {
    paginationProps: { page?: number; perPage?: number };
    search?: string;
  },
  AxiosError
>({
  //@ts-ignore
  queryKey: ["inspections", this?.variables],
  fetcher: async (variables) => {
    const urlEncodedInput = getEncodedInput({
      paginationProps: variables.paginationProps,
      search: variables.search,
    });

    return axios
      .get(`/trpc/inspection.getAll?input=${urlEncodedInput}`)
      .then((response) => response?.data?.result?.data.json)
      .catch((error) => error);
  },
});

export const useCreateInspection = createMutation<
  InspectionType,
  { propertyId?: string; structureId?: string },
  AxiosError
>({
  mutationFn: async (variables) => {
    const data = JSON.stringify({
      json: {
        propertyId: variables.propertyId,
        structureId: variables.structureId,
        status: INSPECTION_STATUS.NO_IMAGES,
      },
    });

    return await axios
      .post("/trpc/inspection.create", data)
      .then((response) => response?.data?.result?.data.json);
  },
});

export const useUpdateInspection = createMutation<
  InspectionType,
  Partial<InspectionType>,
  AxiosError
>({
  mutationFn: async (variables) => {
    return await axios
      .post("/trpc/inspection.update", JSON.stringify({ json: variables }))
      .then((response) => response?.data?.result?.data.json);
  },
});
