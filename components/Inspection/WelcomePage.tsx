import { AntDesign } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

import Button from "../ui/Button";

const GuidesData = [
  {
    link: "https://inspect.properties/guides/create-your-first-inspection-on-inspect.properties",
    title: "Create your first inspection on Inspect. Properties",
    description: "A simple guide to create an inspection on inspect properties",
  },
  {
    link: "https://inspect.properties/guides/add-your-images-to-inpsect-properties-from-company-cam",
    title: "Add your images to Inspect. Properties from Company Cam",
    description:
      "A simple way to import images from Company Cam to inspect Properties without hassle",
  },
  {
    link: "https://inspect.properties/guides/quickly-estimate-material-requirements-and-cost-with-our-estimates-tool",
    title:
      "Quickly estimate material requirements and cost with our estimates tool",
    description:
      "Quickly create a material estimate and costs report using our tool in your dashboard",
  },
  {
    link: "https://inspect.properties/guides/how-to-update-company-details-in-your-profile",
    title: "How to update Company details in your profile",
    description:
      "Update your company details in your profile and get customized reports with your company information ready to use for your business",
  },
];

export default function WelcomePage() {
  return (
    <View className="flex gap-2 pb-8">
      <Text className="text-center text-xl font-medium">
        Welcome to <Text className="text-primary">Inspect.Properties</Text>
      </Text>
      <Text className="text-center text-lg text-gray-500">
        Start your first Inspection by clicking below and enter the address
      </Text>
      <Button
        title="Start Inspection"
        className="mx-auto mb-4 w-[70%] rounded-full"
        onPress={() => router.push("/create")}
      />
      <Text className="font-medium text-gray-500">
        Check out the resources below to help you get started
      </Text>

      <View className="my-4 gap-2">
        <Text className="text-lg font-semibold">Let data do the selling</Text>
        <Text className="text-gray-500">
          Gain accurate and detailed assessments without the need for manual
          inspections, reducing risk and turnaround time.
        </Text>
        <Text
          className="font-medium text-primary"
          onPress={() =>
            Linking.openURL(
              "https://www.youtube.com/watch?v=EtgU2f-sWzU&ab_channel=Granular"
            )
          }
        >
          How it works (video)
        </Text>
      </View>

      <View className="gap-8 rounded-2xl bg-primary/20 px-4 py-6">
        <View>
          <Text className="mb-2 text-xl font-medium">Onboarding Guides</Text>
          <Text className="text-sm text-gray-500">
            Review these guides to learn best practices when running an
            <Text className="font-bold text-primary">
              {" "}
              inspect.properties
            </Text>{" "}
            report.
          </Text>
        </View>
        {GuidesData.map((item, index) => (
          <View key={index}>
            <Text
              className="mb-1 font-medium text-primary"
              onPress={() => Linking.openURL(item.link)}
            >
              {item.title}{" "}
              <AntDesign
                name="arrowright"
                size={14}
                className="mt-2 shrink-0"
              />
            </Text>
            <Text className="text-gray-500">{item.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
