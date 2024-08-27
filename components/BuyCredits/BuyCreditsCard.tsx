import {
  AntDesign,
  EvilIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useAnalytics } from "@segment/analytics-react-native";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Toast from "react-native-root-toast";
import WebView from "react-native-webview";

import { queryClient } from "@/api/apiProvider";
import { useSendCreditsAddedNotification } from "@/api/useEmail";
import {
  useCreateCheckoutSession,
  useGetStripeCustomer,
  useUpdateCustomer,
} from "@/api/useStripe";
import { useSession } from "@/contexts/authProvider";
import { commonContainer } from "@/libs/commonStyles";
import { REPORT_STRIPE_PRICE_IDS } from "@/libs/constants";
import { ErrorMessageStyle, SuccessMessageStyle } from "@/libs/ToastStyles";
import { getPrimaryOrg } from "@/libs/utils";

import Button from "../ui/Button";

const initialCartData = [
  {
    id: 1,
    Icon: (
      <MaterialCommunityIcons
        name="tape-measure"
        size={40}
        color="black"
        className="size-16 stroke-1 md:size-[64px] md:stroke-[0.6px]"
      />
    ),
    priceId: REPORT_STRIPE_PRICE_IDS["Measurements Report"].paid,
    title: "Measurements Report",
    description: "Human-generated, user-reviewed property measurements.",
    price: 15.0,
    quantity: 1,
  },
  {
    id: 2,
    Icon: (
      <Ionicons
        name="thunderstorm-outline"
        size={40}
        color="black"
        className="size-16 stroke-1 md:size-[64px] md:stroke-[0.6px]"
      />
    ),
    priceId: REPORT_STRIPE_PRICE_IDS["Weather Report"].paid,
    title: "Weather Report",
    description: "Hail damage detection and history storm activity.",
    price: 25.0,
    quantity: 1,
  },
  {
    id: 3,
    Icon: (
      <MaterialCommunityIcons
        name="home-alert-outline"
        size={40}
        color="black"
        className="size-16 stroke-1 md:size-[64px] md:stroke-[0.6px]"
      />
    ),
    priceId: REPORT_STRIPE_PRICE_IDS["Proof-of-Loss Report"].paid,
    title: "Proof-of-loss Report",
    description:
      "Roof overview and elements visible on the roof. Requires at least 10 inspection images.",
    price: 60.0,
    quantity: 1,
  },
];

type Props = {
  setOpen: (value: boolean) => void;
};

export const BuyCreditsCard = ({ setOpen }: Props) => {
  const [cart, setCart] = useState(initialCartData);
  const { session } = useSession();
  const [paymentUrl, setPaymentUrl] = useState<string | undefined>();

  const { track } = useAnalytics();

  const { data: customer } = useGetStripeCustomer({
    variables: { customerId: session?.metadata?.customerId as string },
    enabled: !!session?.metadata?.customerId,
  });

  const {
    mutateAsync: createCheckoutSession,
    isPending: isCreatingCheckoutSession,
  } = useCreateCheckoutSession();

  const { mutateAsync: updateCustomer, isPending: isCustomerUpdating } =
    useUpdateCustomer({
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["getStripeCustomer"] });
      },
    });

  const { mutateAsync: sendCreditsAddedNotification, isPending: isSendEmail } =
    useSendCreditsAddedNotification({
      onSettled() {
        Toast.show(
          "Congratulations! Your reports credits are available now.",
          SuccessMessageStyle
        );
        setCart(initialCartData);
        setPaymentUrl(undefined);
        setOpen(false);
      },
    });

  const credits = JSON.parse(customer?.metadata?.credits || "{}");

  const orgId = getPrimaryOrg(session?.roles)?.id;

  const getNewCredits = () => {
    const newCredits = { ...credits };

    cart.forEach((item) => {
      if (item.title.toLowerCase().includes("measurements")) {
        newCredits.measurements =
          (newCredits.measurements || 0) + item.quantity;
      }
      if (item.title.toLowerCase().includes("weather")) {
        newCredits.weather = (newCredits.weather || 0) + item.quantity;
      }
      if (item.title.toLowerCase().includes("proof-of-loss")) {
        newCredits["proof-of-loss"] =
          (newCredits["proof-of-loss"] || 0) + item.quantity;
      }
    });

    return newCredits;
  };

  const removeFromCart = (id: number) => {
    if (cart.length > 1) {
      const newCart = cart.filter((item) => item.id !== id);
      setCart(newCart);
    }
  };
  const updateQuantity = (id: number, quantity: number) => {
    setCart(
      cart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handlePaymentIntent = () => {
    createCheckoutSession(
      {
        lineItems: cart.map(({ priceId, quantity }) => ({
          price: priceId,
          quantity,
        })),
        customerId: session?.metadata?.customerId,
        email: session?.email || "",
        successUrl: `${process.env.EXPO_PUBLIC_BASE_URL}/payment/success`,
      },
      {
        onSuccess(data) {
          if (data?.url) setPaymentUrl(data.url);
        },
      }
    ).catch(() => {
      Toast.show(
        "Something went wrong. Please try again later",
        ErrorMessageStyle
      );
    });
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;

    if (url.includes(`${process.env.EXPO_PUBLIC_BASE_URL}/payment/success`)) {
      updateCustomer(
        {
          customerId: customer?.id,
          credits: JSON.stringify(getNewCredits()),
        },
        {
          onSuccess() {
            sendCreditsAddedNotification({
              orgId: orgId || "",
              credits: getNewCredits(),
            }).catch(() => {
              track("Send Credits Added Notification Failed", {
                email: session?.email,
              });
            });
          },
        }
      ).catch(() => {
        Toast.show(
          "Something went wrong, Our team is working on it.",
          ErrorMessageStyle
        );
      });
    }
  };

  return paymentUrl ? (
    <WebView
      source={{ uri: paymentUrl }}
      onNavigationStateChange={handleNavigationStateChange}
    />
  ) : (
    <ScrollView contentContainerStyle={commonContainer.container}>
      <View className="flex flex-col gap-4">
        <Text className="text-2xl font-bold">Buy More Credits</Text>
        <View className="flex h-full max-h-[700px] min-h-0 flex-1 flex-col gap-4 overflow-y-auto md:max-h-[auto]">
          {cart.map((item) => (
            <View
              key={item.id}
              className="grid grid-cols-1  md:grid-cols-[100px_1fr_auto]"
            >
              {item.Icon}
              <View className="grid gap-1">
                <Text className="text-lg font-medium">{item.title}</Text>
                <Text className="text-sm text-gray-500">
                  {item.description}
                </Text>
              </View>
              <View className="mb-2 mt-4 flex flex-row items-center gap-8">
                <View className="flex flex-row items-center gap-8">
                  <AntDesign
                    name="minus"
                    size={20}
                    color="black"
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity === 1}
                  />
                  <Text className="w-10 text-center">{item.quantity}</Text>
                  <AntDesign
                    name="plus"
                    size={20}
                    color="black"
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  />
                </View>
                <Text className="font-medium">${item.price.toFixed(2)}</Text>
                <EvilIcons
                  name="trash"
                  size={20}
                  color="black"
                  onPress={() => removeFromCart(item.id)}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
      <View className="mt-8 grid min-h-0 gap-4 border-t border-gray-500 ">
        <View className="mt-4 flex flex-row items-center justify-between">
          <Text className="font-medium">Total</Text>
          <Text className="text-2xl font-bold">${total.toFixed(2)}</Text>
        </View>
        <Button
          title="Continue"
          disabled={isCreatingCheckoutSession}
          isLoading={isCreatingCheckoutSession}
          onPress={handlePaymentIntent}
        />
      </View>
    </ScrollView>
  );
};
