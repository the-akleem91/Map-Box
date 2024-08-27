import type { AxiosError } from "axios";
import { createMutation, createQuery } from "react-query-kit";

import { axios } from "@/libs/axios";

import { getEncodedInput } from "./utils";

export const useGetStripeCustomer = createQuery<
  Record<string, any>,
  { customerId: string },
  AxiosError
>({
  queryKey: ["getStripeCustomer"],
  fetcher: async (variables) => {
    const input = getEncodedInput(variables);

    const response = await axios
      .get(`/trpc/stripe.getCustomer?input=${input}`)
      .then((res) => res?.data);

    return response?.result?.data.json;
  },
});

export const useCreatePaymentIntent = createMutation<
  Record<string, any>,
  {
    email: string;
    amount: number;
    customerId?: string;
    description?: string;
    inspectionId?: string;
    selectedReports?: string;
  },
  AxiosError
>({
  mutationFn: async (variables) => {
    try {
      return await axios
        .post(
          "/trpc/stripe.createPaymentIntent",
          JSON.stringify({ json: variables })
        )
        .then((response) => response?.data?.result?.data.json);
    } catch (error: any) {
      console.log(error.response.data.error);
    }
  },
});

export const useCreateCheckoutSession = createMutation<
  Record<string, any>,
  {
    lineItems: Array<{ price: string; quantity?: number }>;
    inspectionId?: string;
    email: string;
    successUrl?: string;
    cancelUrl?: string;
    customerId?: string;
    selectedReports?: string;
  }
>({
  mutationFn: async (variables) => {
    try {
      return await axios
        .post(
          "/trpc/stripe.createCheckoutSession",
          JSON.stringify({ json: variables })
        )
        .then((response) => response?.data?.result?.data.json);
    } catch (error: any) {
      console.log(error.response.data.error);
    }
  },
});

export const useUpdateCustomer = createMutation<
  Record<string, any>,
  {
    customerId: string;
    credits?: string; // will add the other field later
  },
  AxiosError
>({
  mutationFn: async (variables) => {
    return await axios
      .post("/trpc/stripe.updateCustomer", JSON.stringify({ json: variables }))
      .then((response) => response?.data?.result?.data.json);
  },
});
