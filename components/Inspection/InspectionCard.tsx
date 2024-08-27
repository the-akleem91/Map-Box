import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
import utc from "dayjs/plugin/utc";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import type { InspectionType } from "@/types/inspection";

import ReportBadges from "./ReportBadges";
dayjs.extend(utc);
dayjs.extend(timezone);
type Props = {
  data?: InspectionType;
};

function InspectionCard({ data: inspection }: Props) {
  const address = inspection?.property?.address;
  const propertyAddress = address?.split(",");
  const propertyStreet = propertyAddress ? propertyAddress[0] : "";
  const cityAndZipCode = propertyAddress
    ?.slice(1, propertyAddress.length)
    .filter((item: string) => item !== " United States")
    .join(", ");

  const structure = inspection?.property?.structures?.find(
    (structure) => structure?.id === inspection?.structureId
  );
  return (
    <Pressable
      onPress={() => router.push(`/inspection/${inspection?.id}`)}
      className="mb-4 flex w-full gap-4 rounded-xl border border-[#d4d4d871] bg-white px-4 py-6"
    >
      <View>
        <View className="flex-1 flex-row items-center justify-between">
          <Text className="ml-1 text-base font-semibold text-primary">
            {propertyStreet}
          </Text>
          <Text className="text-xs text-gray-500">
            {dayjs
              .utc(inspection?.createdAt)
              .local()
              .format("MMM DD, YYYY , hh:mm A")}
          </Text>
        </View>
        <Text className="mt-1 text-gray-500">{cityAndZipCode}</Text>
      </View>
      <View className="flex-row justify-between">
        <View className="flex-col items-center justify-center rounded-md bg-primary/10">
          <Text className="px-3 py-1 text-sm font-semibold capitalize text-primary">
            {structure?.name || "--"}
          </Text>
        </View>
        <ReportBadges inspection={inspection} />
      </View>
    </Pressable>
  );
}

export default InspectionCard;
