import type { AxiosError } from "axios";
import axiosInstance from "axios";
import { createMutation } from "react-query-kit";

import { axios } from "@/libs/axios";
import { BASE_API_URL } from "@/libs/constants";
import type { User } from "@/types/user";

export interface RegisterProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginProps {
  email: string;
  password: string;
}

export const useRegister = createMutation<User, RegisterProps, AxiosError>({
  mutationFn: async (values) => {
    const resp = await axiosInstance.post(
      `${BASE_API_URL}/external/register`,
      values
    );

    return resp?.data as User;
  },
});

export const useLogin = createMutation<User, LoginProps, AxiosError>({
  mutationFn: async (values) => {
    const resp = await axiosInstance.post(
      `${BASE_API_URL}/external/login`,
      values
    );

    return resp?.data as User;
  },
});

export const useVerifyEmail = createMutation<
  { message: string },
  { userId: string; token: string },
  AxiosError
>({
  mutationFn: async (input) => {
    const res = await axios.post(
      "/trpc/user.verifyEmail",
      JSON.stringify({ json: input })
    );

    return res?.data?.result?.data.json;
  },
});

export const useForgotPassword = createMutation<
  {
    user: {
      firstName: string;
      lastName: string;
    };
    token: string;
  },
  {
    email: string;
    baseUrl: string;
  },
  AxiosError
>({
  mutationFn: async (input) => {
    const res = await axios.post(
      `/trpc/auth.forgotPassword`,
      JSON.stringify({ json: input })
    );

    return res?.data?.result?.data.json;
  },
});
