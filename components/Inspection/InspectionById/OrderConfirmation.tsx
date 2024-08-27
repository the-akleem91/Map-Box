import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

import { cn } from "@/libs/utils";

type Props = {
  requestedReports: Array<{
    title: string;
    description: string;
    price: number;
  }>;
  subtotal: number;
  total: number;
  discountPrice: number;
  discountPercent: number;
  email: string;
  children?: React.ReactNode;
};

export const OrderConfirmation = ({
  requestedReports,
  subtotal,
  total,
  discountPrice,
  discountPercent,
  email,
  children,
}: Props) => {
  return (
    <View className="max-h-screen overflow-y-auto rounded-sm bg-white p-4">
      <View className="mb-2 flex flex-col items-center justify-center text-center">
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={50}
          color="#22c55e"
          className="mt-4 block w-14 text-green-500"
        />
        <Text className="mb-2 mt-4 text-2xl font-semibold">
          Congratulations
        </Text>
        <Text className="text-sm text-gray-500">
          This order confirmation has been sent to {email}
        </Text>
      </View>
      <View className="my-4 w-full border-t border-gray-200" />

      <View>
        <Text className="mb-4 text-xl font-medium">Your Order</Text>
        {requestedReports?.map((report, index) => (
          <View
            key={report.title}
            className={cn(
              "flex flex-row justify-between items-start pb-3 ml-4",
              index !== 0 && "border-t pt-2 border-gray-200"
            )}
          >
            <View>
              <Text className="font-semibold">{report.title}</Text>
              <Text className="mt-1 text-xs font-normal text-gray-500">
                {report.description}
              </Text>
            </View>

            <Text className="font-semibold">${report.price}</Text>
          </View>
        ))}
      </View>

      <View className="my-4 mt-2 w-full border-t border-gray-200" />
      <View>
        <View className="mb-4 flex flex-row justify-between text-xl font-medium">
          <Text className="">Subtotal</Text>
          <Text className="">${subtotal} USD</Text>
        </View>
        <View className="my-4 w-full border-t border-gray-200" />
        <View className="mb-2 flex flex-row justify-between text-sm text-gray-600">
          <Text className="">Discount</Text>
          {total !== subtotal ? (
            <Text className="">
              -${discountPrice} {`(${discountPercent}%OFF)`}
            </Text>
          ) : (
            <Text className="">$0 USD</Text>
          )}
        </View>
        <View className="flex flex-row justify-between text-sm text-gray-600">
          <Text>Tax</Text>
          <Text>$0</Text>
        </View>
      </View>

      <View className="my-4 w-full border-t border-gray-200" />
      <View className="mb-5 flex flex-row justify-between text-xl font-medium">
        <Text className="">Grand Total</Text>
        <Text className="">${total} USD</Text>
      </View>

      {children}
    </View>
  );
};
