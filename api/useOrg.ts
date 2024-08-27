import type { AxiosError } from "axios";
import { createMutation, createQuery } from "react-query-kit";

import { axios } from "@/libs/axios";
import type { Org } from "@/types/org";

import { getEncodedInput } from "./utils";

export const useOrgById = createQuery<Org, { orgId: string }, AxiosError>({
  //@ts-ignore
  queryKey: ["orgById", this?.variables],
  fetcher: async (variables) => {
    const urlEncodedInput = getEncodedInput(variables);

    return axios
      .get(`/trpc/org.getOrgById?input=${urlEncodedInput}`)
      .then((response) => response?.data?.result?.data.json)
      .catch((error) => error);
  },
});

export const useUpdateOrgLogo = createMutation<
  string,
  {
    orgId: string;
    logoBase64: string;
  },
  AxiosError
>({
  mutationFn: async (variables) => {
    return await axios
      .post("/trpc/org.updateLogo", JSON.stringify({ json: variables }))
      .then((response) => response?.data?.result?.data.json.logo);
  },
});

export const useUpdateOrg = createMutation<
  any,
  {
    id: string;
    orgId: string;
    name: string;
  },
  AxiosError
>({
  mutationFn: async (variables) => {
    return await axios
      .post("/trpc/org.update", JSON.stringify({ json: variables }))
      .then((response) => response?.data?.result?.data.json.logo);
  },
});
