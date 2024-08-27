import type { AxiosError } from "axios";
import { createMutation } from "react-query-kit";

import { axios } from "@/libs/axios";
import type { User } from "@/types/user";

export const useUpdateUser = createMutation<
  User,
  {
    id: string;
    firstName: string;
    lastName: string;
    newPassword: string;
    oldPassword: string;
    organisationName: string;
  },
  AxiosError
>({
  ///@ts-ignore
  mutationFn: async (variables) => {
    const data = JSON.stringify({
      json: variables,
    });
    return await axios.post("/trpc/user.update", data).then((response) => {
      response?.data?.result?.data.json;
    });
  },
});

export const useUpdateAvatar = createMutation<
  string,
  {
    id: string;
    avatarBase64: string;
  },
  AxiosError
>({
  mutationFn: async (variables) => {
    return await axios
      .post("/trpc/user.updateAvatar", JSON.stringify({ json: variables }))
      .then((response) => response?.data?.result?.data.json.avatar);
  },
});
