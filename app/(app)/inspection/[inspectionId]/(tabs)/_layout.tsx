import { AntDesign } from "@expo/vector-icons";
import { router, Tabs, useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useInspection } from "@/api/useInspection";
import HeaderAddress from "@/components/Inspection/HeaderAddress";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { getDetailedAddress } from "@/libs/utils";

const tabList = [
  { name: "index", title: "Overview", iconName: "home" },
  { name: "images", title: "Images", iconName: "image" },
  { name: "reports", title: "Reports", iconName: "document" },
];

export default function TabLayout() {
  const { inspectionId } = useLocalSearchParams();
  const navigation = useNavigation();

  const { data: inspection, isLoading } = useInspection({
    variables: { id: inspectionId as string },
    enabled: !!inspectionId,
  });

  const address = inspection?.property?.address;
  const { cityAndZipCode, propertyStreet } = getDetailedAddress(address);

  const headerTitle = (props: any) => {
    return isLoading ? (
      <Text style={{ fontSize: 24, fontWeight: "500" }}>Inspection</Text>
    ) : (
      <HeaderAddress
        propertyStreet={propertyStreet}
        cityAndZipCode={cityAndZipCode}
        {...props}
      />
    );
  };

  const headerLeft = (props: any) => {
    return (
      <Pressable onPress={() => router.push(`/`)}>
        <AntDesign size={24} className="mx-4 ml-8 p-4" name="arrowleft" />
      </Pressable>
    );
  };

  navigation.setOptions({
    headerLeft,
    headerBackVisible: false,
    headerTitle,
    headerTitleAlign: "left",
    headerStatusBarHeight: 8,
    tabBarStyle: { display: isLoading ? "none" : "block" },
  });

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: 20 }}
      edges={["left", "right", "bottom"]}
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#4F46E5",
          headerShown: false,
          tabBarHideOnKeyboard: true,
          headerTitleStyle: {
            fontWeight: "semibold",
            fontSize: 28,
          },
        }}
      >
        {tabList.map((tab) => {
          const renderIcon = ({
            color,
            focused,
          }: {
            color: string;
            focused: boolean;
          }) => (
            <TabBarIcon
              //@ts-ignore
              name={focused ? tab.iconName : `${tab.iconName}-outline`}
              color={color}
              allowFontScaling={true}
            />
          );

          return (
            <Tabs.Screen
              name={tab.name}
              options={{
                title: tab.title,
                tabBarIcon: renderIcon,
              }}
            />
          );
        })}
      </Tabs>
    </SafeAreaView>
  );
}
