import { Entypo } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { useInspections } from "@/api/useInspection";

import Loader from "../ui/Loader";
import Select from "../ui/Select";
import InspectionCard from "./InspectionCard";

type Props = {
  search?: string;
  setPerPage: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  total?: number;
  currentPage?: number;
  perPage: number;
};

export default function InspectionList({
  search,
  setPerPage,
  total = 10,
  setCurrentPage,
  currentPage, // provide a default value
  perPage,
}: Props) {
  const { data, isPending } = useInspections({
    variables: {
      paginationProps: { page: currentPage, perPage: perPage },
      search,
    },
  });

  const totalPages = Math.ceil(total / perPage);

  if (isPending) return <Loader />;

  if (!data || !data?.results?.length) {
    return (
      <Text className="py-20 text-center text-gray-500">No results found.</Text>
    );
  }
  return (
    <View>
      {data?.results.map((item, index) => (
        <InspectionCard data={item} key={index} />
      ))}

      {data?.total !== undefined && data?.total > 10 && (
        <View className="flex-row items-center justify-between gap-2 px-4 py-2">
          <Select perPage={perPage} setPerPage={setPerPage} />
          <Text className="font-bold">
            Page {currentPage} of {totalPages}
          </Text>

          <View className="flex-row gap-1">
            <Pressable
              onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-xl border border-gray-400/20 bg-white p-2"
            >
              <Entypo
                name="chevron-small-left"
                size={24}
                color={currentPage === 1 ? "#80808050" : "black"}
              />
            </Pressable>
            <Pressable
              onPress={() =>
                setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
              }
              className="rounded-xl border border-gray-400/20 bg-white p-2"
              disabled={currentPage === totalPages}
            >
              <Entypo
                name="chevron-small-right"
                size={24}
                color={currentPage === totalPages ? "#80808050" : "black"}
              />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
