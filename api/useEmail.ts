import type { AxiosError } from "axios";
import { createMutation } from "react-query-kit";

import { axios } from "@/libs/axios";
import { BASE_API_URL } from "@/libs/constants";

export const useSendReportGenerationNotification = createMutation<
  string,
  {
    address: string;
    selectedReports: Record<string, any>;
    subtotal: number;
    total: number;
    discountPercentage: string;
    discountValue: number;
    orderLink: string;
    orgId?: string;
    inspectionId: string;
  }
>({
  mutationFn: async (variables) => {
    return await axios
      .post(
        "/trpc/email.sendReportGenerationNotification",
        JSON.stringify({ json: variables })
      )
      .then((response) => response?.data?.result?.data.json);
  },
});

export const useSendCreditsAddedNotification = createMutation<
  string,
  {
    credits: Record<string, any>;
    orgId?: string;
  }
>({
  mutationFn: async (variables) => {
    return await axios
      .post(
        "/trpc/email.sendCreditsAddedNotification",
        JSON.stringify({ json: variables })
      )
      .then((response) => response?.data?.result?.data.json);
  },
});

export const useSendResetPasswordEmail = createMutation<
  string,
  {
    firstName: string;
    lastName: string;
    userEmail: string;
    resetLink: string;
    loginLink: string;
  },
  AxiosError
>({
  mutationFn: async (variables) => {
    return await axios
      .post(
        `${BASE_API_URL}/trpc/email.sendResetPasswordEmail`,
        JSON.stringify({ json: variables })
      )
      .then((response) => response?.data?.result?.data.json);
  },
});

export const useSendVerificationCode = createMutation<
  { message: string },
  { userEmail: string; verificationLink: string; userId: string },
  AxiosError
>({
  mutationFn: async (variables) => {
    const res = await axios.post(
      "/trpc/email.sendEmailVerification",
      JSON.stringify({ json: variables })
    );
    return res?.data?.result?.data.json;
  },
});
