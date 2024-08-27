import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { useGetStripeCustomer } from "@/api/useStripe";
import { useSession } from "@/contexts/authProvider";

import { BuyCreditsCard } from "../BuyCredits/BuyCreditsCard";
import ModalComponent from "./Modal";

type Props = {
  isCreditOpen: boolean;
  setIsCreditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
};

type Credits = any;

export default function DropDownMenu({
  isCreditOpen,
  setIsCreditOpen,
  setIsOpen,
}: Props) {
  const { session, isLoading, signOut } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: customer, isLoading: isCustomerLoading } = useGetStripeCustomer(
    {
      variables: { customerId: session?.metadata?.customerId as string },
      enabled: !isLoading && !!session?.metadata?.customerId,
    }
  );

  const credits: Credits = JSON.parse(customer?.metadata?.credits || "{}");

  async function handleLogOut() {
    setIsOpen(false);
    signOut();
    router.replace("/login");
  }

  return (
    <View className="absolute right-10 top-28 w-32 gap-3 rounded-lg border border-gray-200 bg-white p-4">
      <View className="relative">
        <Pressable onPress={() => setIsCreditOpen(!isCreditOpen)}>
          <View className="flex-row items-center justify-between">
            <Text className="flex-row text-lg">Credits</Text>
            <Ionicons
              name="chevron-forward-outline"
              className="mt-1 text-gray-500"
            />
          </View>
        </Pressable>

        {isCreditOpen && (
          <View className="absolute left-[-240%] w-52 rounded-lg border border-gray-200 bg-white p-4">
            <Text className="text-lg font-medium text-gray-500">
              Available Credits
            </Text>
            {credits &&
              Object.keys(credits).map((key) => (
                <Text key={key} className="my-1 text-sm capitalize">
                  {key}:{" "}
                  <Text className="font-medium">{credits[key] ?? 0}</Text>
                </Text>
              ))}
            <Pressable
              className=" mt-2 rounded-md bg-primary px-1 py-2"
              onPress={() => setIsModalOpen(true)}
            >
              <Text className="items-center text-center text-white">
                Buy Credits
              </Text>
            </Pressable>
          </View>
        )}
      </View>
      <Pressable
        onPress={() => {
          setIsCreditOpen(false);
          setIsOpen(false);
          router.push("/profile");
        }}
      >
        <Text className="text-lg">Profile</Text>
      </Pressable>
      <Pressable onPress={handleLogOut}>
        <Text className="border-t-[0.2px] border-gray-300 pt-1 font-medium text-red-500">
          Log out
        </Text>
      </Pressable>
      <ModalComponent isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <BuyCreditsCard setOpen={setIsModalOpen} />
      </ModalComponent>
    </View>
  );
}
