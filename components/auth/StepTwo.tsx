import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import Toast from "react-native-root-toast";

import { useVerifyEmail } from "@/api/useAuth";
import { useSendVerificationCode } from "@/api/useEmail";
import { useSession } from "@/contexts/authProvider";
import { BASE_URL } from "@/libs/constants";
import { ErrorMessageStyle, SuccessMessageStyle } from "@/libs/ToastStyles";

import { ThemedView } from "../ThemedView";
import Button from "../ui/Button";

export default function StepTwo() {
  const [otp, setOtp] = useState("");

  const { mutateAsync, isPending } = useVerifyEmail();

  const { mutateAsync: SendVerificationCode } = useSendVerificationCode();
  const { session } = useSession();

  function handleSendVerificationCode() {
    SendVerificationCode(
      {
        userEmail: session?.email || "",
        userId: session?.id || "",
        verificationLink: `${BASE_URL}/email-verification`,
      },
      {
        onSuccess() {
          Toast.show(
            "Verification code sent, Please check your email.",
            SuccessMessageStyle
          );
        },
        onError() {
          Toast.show(
            "Unable to send verification code, Please try again.",
            ErrorMessageStyle
          );
        },
      }
    );
  }

  const router = useRouter();

  async function handleVerifyOTP() {
    if (!otp || !session?.id) return;

    mutateAsync(
      { userId: session.id, token: otp },
      {
        onSuccess() {
          router.push("/");
          Toast.show("Email Verified", SuccessMessageStyle);
        },
      }
    ).catch((error) => {
      console.error(error);
      Toast.show(error.message, ErrorMessageStyle);
    });
  }
  return (
    <ThemedView className="flex-1">
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
        <View className="gap-6 p-4">
          <Text className="ml-1 text-3xl font-bold text-gray-900">
            Verify Email
          </Text>

          <View className="mt-4 flex gap-4">
            <Text className=" ml-1 text-xl text-gray-500">
              Enter 6 digit Code
            </Text>
            <OtpInput
              numberOfDigits={6}
              focusColor="#4F46E5"
              focusStickBlinkingDuration={500}
              onFilled={(text) => setOtp(text)}
              textInputProps={{
                accessibilityLabel: "One-Time Password",
              }}
            />
            <View className="flex-row items-center gap-1">
              <Text
                onPress={handleSendVerificationCode}
                className="mt-2 text-right font-medium text-gray-500 "
              >
                Can’t find code?{" "}
                <Text className="text-primary">Send new code</Text>{" "}
              </Text>
              <Ionicons name="mail-outline" size={16} className="mt-1" />
            </View>
            <Text className="text-gray-500">
              You're almost there! We've sent a verification code to your
              email: 
              <Text style={{ fontWeight: "bold", opacity: 1 }}>
                {session?.email}
              </Text>
            </Text>
          </View>

          <Button
            title="Continue"
            onPress={handleVerifyOTP}
            className="h-16 rounded-xl"
            disabled={!otp || isPending}
            isLoading={isPending}
          />
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
