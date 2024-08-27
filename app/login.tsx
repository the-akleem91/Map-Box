import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Toast from "react-native-root-toast";

import { useLogin } from "@/api/useAuth";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { useSession } from "@/contexts/authProvider";
import { ErrorMessageStyle, SuccessMessageStyle } from "@/libs/ToastStyles";
import type { LoginType } from "@/types";

import { ThemedView } from "../components/ThemedView";
import Input from "../components/ui/Input";

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { signIn } = useSession();

  const { mutateAsync, isPending } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginType) => {
    Keyboard.dismiss();

    mutateAsync(data, {
      onSuccess: async (user) => {
        signIn(user);
        Toast.show("Login Successfully", SuccessMessageStyle);
        // Resetting the navigation stack
        router.navigate("/(app)");
      },
    }).catch((error) => {
      console.log(error.message);
      Toast.show(
        error?.response?.data?.message === "Unauthorized"
          ? "Invalid credentials"
          : error?.response?.data?.message ||
              "Something went wrong. Please try again later",
        ErrorMessageStyle
      );
    });
  };

  return (
    <ThemedView style={style.container}>
      <ThemedView>
        <Image
          source={require("@/assets/images/bg-house.png")}
          style={style.LoginImage}
        />
      </ThemedView>
      <ThemedView className="relative top-[-50px] z-10 flex-1 rounded-t-[48px]">
        <View className="p-4">
          <Image
            source={require("@/assets/images/ip-logo.svg")}
            style={{
              width: "50%",
              height: 40,
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            contentFit="fill"
          />
        </View>
        <View className="p-4">
          <Text className="ml-1 text-3xl font-bold text-gray-900">Login</Text>
          <View className="mt-4 flex gap-4">
            <View>
              <Controller
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Enter your Email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="email"
              />
              {errors.email && (
                <ErrorMessage message={errors?.email?.message as string} />
              )}
            </View>
            <View>
              <View className="relative">
                <Controller
                  control={control}
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must have at least 8 characters",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Enter your Password"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry={!passwordVisible}
                    />
                  )}
                  name="password"
                />
                <View className="absolute right-3 top-[30%]  z-50">
                  <TouchableWithoutFeedback
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  >
                    <Ionicons
                      name={passwordVisible ? "eye-off" : "eye"}
                      size={20}
                      color={"#808080"}
                    />
                  </TouchableWithoutFeedback>
                </View>
              </View>
              {errors.password && (
                <ErrorMessage message={errors?.password?.message as string} />
              )}
              <Pressable onPress={() => router.push("/forgot")}>
                <Text className="ml-auto mr-1 mt-4 text-primary font-medium">
                  Forgot Password
                </Text>
              </Pressable>
            </View>

            <Button
              title="Login"
              size="lg"
              className="h-16 rounded-xl"
              isLoading={isPending}
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
            />
            <Text className="text-center opacity-50">or</Text>
            <Text className="text-center font-medium text-gray-500">
              Did not have an account?{" "}
              <Link
                href={"/register?step=detail"}
                className="text-primary underline"
              >
                Register
              </Link>
            </Text>
          </View>
        </View>
      </ThemedView>
    </ThemedView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  LoginImage: {
    height: 230,
    resizeMode: "cover",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 2,
    marginTop: 8,
  },
});
