import type { AxiosError } from "axios";
import { createMutation } from "react-query-kit";

import { axios } from "@/libs/axios";

export const useSendAlert = createMutation<
  string,
  { channel: string; message: string },
  AxiosError
>({
  mutationFn: async (variables) => {
    return await axios
      .post("/trpc/slack.sendAlert", JSON.stringify({ json: variables }))
      .then((response) => response?.data?.result?.data.json);
  },
});

export const useSendSlackThread = createMutation<
  string,
  {
    channel: string;
    text: string;
    thread_ts: string;
  }
>({
  mutationFn: async (variables) => {
    return await axios
      .post("/trpc/slack.sendThread", JSON.stringify({ json: variables }))
      .then((response) => response?.data?.result?.data.json);
  },
});
