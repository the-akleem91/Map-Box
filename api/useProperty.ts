import type { AxiosError } from "axios";
import { createMutation } from "react-query-kit";

import { axios } from "@/libs/axios";
import type { PropertyType } from "@/types/property";

export const useCreateProperty = createMutation<
  PropertyType,
  {
    address: string;
    propertyType: string;
    structures: {
      name: string;
      bbox: number[];
      geometry: number[];
    }[];
    coordinates: number[];
  },
  AxiosError
>({
  mutationFn: async (variables) => {
    try {
      return await axios
        .post("/trpc/property.create", JSON.stringify({ json: variables }))
        .then((response) => response?.data?.result?.data.json);
    } catch (err: any) {
      console.log(err?.response?.data);
    }
  },
});
