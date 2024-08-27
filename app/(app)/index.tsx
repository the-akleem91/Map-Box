import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { useInspections } from "@/api/useInspection";
import InspectionList from "@/components/Inspection/InsepectionList";
import WelcomePage from "@/components/Inspection/WelcomePage";
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import { useDebounce } from "@/hooks/useDebounce";
import { commonContainer } from "@/libs/commonStyles";

export default function HomeScreen() {
  // const [inspections, setInspections] = useState<InspectionType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const navigation = useNavigation();

  const { data, isPending } = useInspections({
    variables: { paginationProps: { page: 1, perPage: 10 } },
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const inspections = data?.results;
  const total = data?.total;

  const headerLeft = () => (
    <Image
      source={require("@/assets/images/ip-logo2.svg")}
      style={{
        width: 56,
        height: 32,
        marginRight: 12,
      }}
      contentFit="fill"
    />
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Inspections",
      headerTitleStyle: {
        fontSize: 24,
        fontWeight: "600",
        color: "#0F172A",
      },
      headerLeft,
    });
  }, [navigation]);

  if (isPending) {
    return <Loader />;
  }

  return (
    <ScrollView contentContainerStyle={commonContainer.container}>
      {inspections?.length === 0 ? (
        <WelcomePage />
      ) : (
        <View>
          <View className="mb-4 w-full flex-row items-center justify-between gap-4">
            <View className="grow">
              <Input
                placeholder="Search order"
                className="w-full"
                onChangeText={(text) => setSearch(text)}
              />
            </View>
            <Pressable
              className="shrink-0 rounded-xl bg-primary p-3"
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add" size={24} color={"white"} />
            </Pressable>
          </View>

          <InspectionList
            setCurrentPage={setCurrentPage}
            setPerPage={setPerPage}
            total={total}
            currentPage={currentPage}
            perPage={perPage}
            search={debouncedSearch}
          />
        </View>
      )}
    </ScrollView>
  );
}
