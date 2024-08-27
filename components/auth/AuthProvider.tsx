import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import Login from "../../app/login";

type Props = {
  children?: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function CheckIfUserLoggedIn() {
      const value = await AsyncStorage.getItem("userToken");
      const userToken = value && JSON.parse(value);

      if (userToken) {
        setIsLoggedIn(true);
      } else {
        router.push("/login");
        setIsLoggedIn(false);
      }
      setIsLoading(false); // Loading finished
    }

    CheckIfUserLoggedIn();
  }, []);

  if (isLoading) {
    return (
      <ActivityIndicator
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        size="large"
        color={"#4F46E5"}
      />
    );
  }
  if (!isLoggedIn) return <Login />;
  return <View style={{ flex: 1 }}>{children}</View>;
}
