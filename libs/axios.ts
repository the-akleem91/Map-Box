import axios from "axios";

import { getStorage } from "@/hooks/useStorageState";

import { BASE_API_URL } from "./constants";

const axiosInstance = axios.create({
  baseURL: BASE_API_URL, // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    // Fetch the token from AsyncStorage
    const session = await getStorage("auth_session");
    if (session) {
      // Set the Authorization header if the token exists
      config.headers.Authorization = `Bearer ${session.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance as axios };
