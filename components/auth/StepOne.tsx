import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-root-toast";

import { useRegister } from "@/api/useAuth";
import { useSession } from "@/contexts/authProvider";
import { ErrorMessageStyle } from "@/libs/ToastStyles";

import { ThemedView } from "../ThemedView";
import Button from "../ui/Button";
import ErrorMessage from "../ui/ErrorMessage";
import Input from "../ui/Input";

export default function StepOne() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();
  const { signIn } = useSession();

  const { mutateAsync, isPending } = useRegister();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (input: any) => {
    Keyboard.dismiss();

    mutateAsync(input, {
      onSuccess: async (data) => {
        signIn(data);
        Toast.show("Verification code is sent to your Email");
        router.navigate("/register?step=verify");
      },
    }).catch((error) => {
      Toast.show(
        error?.response?.data?.message ||
          "Something went wrong Please try again later",
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
      <ThemedView className="relative -top-[50px] z-10 flex-1 rounded-t-[48px]">
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
          <Text className="ml-1 text-3xl font-bold text-gray-900">
            Register
          </Text>
          <View className="mt-4 flex gap-4">
            <View className="flex-row justify-between gap-4">
              <View style={{ width: "47%" }}>
                <Controller
                  control={control}
                  rules={{
                    required: "Required",
                    minLength: {
                      value: 1,
                      message: "Required",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="First Name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="firstName"
                />
                {errors.firstName && (
                  <ErrorMessage message={errors?.email?.message as string} />
                )}
              </View>
              <View style={{ width: "47%" }}>
                <Controller
                  control={control}
                  rules={{
                    required: "Required",
                    minLength: {
                      value: 1,
                      message: "Required",
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Last Name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="lastName"
                />
                {errors.lastName && (
                  <ErrorMessage message={errors?.lastName?.message as string} />
                )}
              </View>
            </View>

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
                    validate: {
                      hasUpperCase: (value) =>
                        /[A-Z]/.test(value) ||
                        "Password must contain at least one uppercase letter",
                      hasLowerCase: (value) =>
                        /[a-z]/.test(value) ||
                        "Password must contain at least one lowercase letter",
                      hasNumber: (value) =>
                        /\d/.test(value) ||
                        "Password must contain at least one number",
                      hasSpecialChar: (value) =>
                        /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                        "Password must contain at least one special character",
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
            </View>
            <Button
              title="Continue"
              onPress={handleSubmit(onSubmit)}
              className="h-16 rounded-xl"
              disabled={isPending}
              isLoading={isPending}
            />
            <Text className="text-center opacity-50">or</Text>
            <Text className="text-center font-medium text-gray-500">
              Already have an account ?{" "}
              <Link href={"/login"} className="text-primary underline">
                Login
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
