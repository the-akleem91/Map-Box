import * as SecureStore from "expo-secure-store";
import * as React from "react";
import { Platform } from "react-native";

import type { User } from "@/types/user";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
  return React.useReducer(
    (
      state: [boolean, T | null],
      action: T | null = null
    ): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: User | null) {
  if (Platform.OS === "web") {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    if (value == null) {
      console.log("Deleting key", key);
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
    }
  }
}

export const getStorage = async (key: string) => {
  const parsedData = (value: string | null) => {
    const parsedSession = value ? (JSON.parse(value) as User) : null;

    return parsedSession;
  };
  if (Platform.OS === "web") {
    try {
      if (typeof localStorage !== "undefined") {
        const localStorageValue = localStorage.getItem(key);

        const parsedSession = parsedData(localStorageValue);

        return parsedSession;
      }
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    const value = await SecureStore.getItemAsync(key);
    const parsedSession = parsedData(value);

    return parsedSession;
  }
};

export function useStorageState(key: string): UseStateHook<User> {
  // Public
  const [state, setState] = useAsyncState<User>();

  // Get
  React.useEffect(() => {
    getStorage(key).then((value) => {
      setState(value as User | null);
    });
  }, [key]);

  // Set
  const setValue = React.useCallback(
    (value: User | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}
