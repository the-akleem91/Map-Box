import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-root-toast";

import { useForgotPassword } from "@/api/useAuth";
import { useSendResetPasswordEmail } from "@/api/useEmail";
import Button from "@/components/ui/Button";
import { BASE_URL } from "@/libs/constants";
import { ErrorMessageStyle, SuccessMessageStyle } from "@/libs/ToastStyles";

import { ThemedView } from "../components/ThemedView";
import Input from "../components/ui/Input";

export default function Login() {
  const [email, setEmail] = useState("");

  const { mutateAsync: ForgotPassword, isPending } = useForgotPassword();
  const { mutateAsync: sendResetPasswordEmail, isPending: isSendingEmail } =
    useSendResetPasswordEmail();

  //405 response
  function handleSubmit() {
    if (!email) return;
    ForgotPassword(
      {
        email: email,
        baseUrl: BASE_URL || "",
      },
      {
        onSuccess(data) {
          sendResetPasswordEmail(
            {
              firstName: data?.user.firstName || "",
              lastName: data?.user.lastName || "",
              userEmail: email || "",
              resetLink: `${BASE_URL}/password-reset/${data.token}` || "",
              loginLink: `${BASE_URL}/password-reset/${data.token}` || "",
            },
            {
              onSuccess(data) {
                console.log(data);
                Toast.show(
                  "Instructions sent, please check your mailbox for the account recovery email.",
                  SuccessMessageStyle
                );
              },
            }
          );
        },
      }
    ).catch((error: any) => {
      console.log(error.message);
      Toast.show(
        "Something went wrong , Please try again later",
        ErrorMessageStyle
      );
    });
  }

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
          <Text className="text-3xl font-bold text-gray-900">
            Recover Your Account
          </Text>
          <Text className="my-2 text-gray-500">
            Enter the email associated with your account and we'll send an email
            with instructions to reset your password.
          </Text>
          <View className="my-6">
            <Input
              placeholder="Enter your Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <Button
            title="Send Instruction"
            className="h-16 rounded-xl"
            isLoading={isPending || isSendingEmail}
            onPress={handleSubmit}
            disabled={isPending || isSendingEmail}
          />
        </View>

        <Text className="text-center opacity-50">or</Text>
        <Text className="text-center font-medium text-gray-500 mt-4">
          Go back to{" "}
          <Link href={"/login"} className="text-primary underline">
            Login
          </Link>
        </Text>
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
});
