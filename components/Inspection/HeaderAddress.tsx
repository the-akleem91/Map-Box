import { Text, View } from "react-native";

type Props = {
  propertyStreet: String;
  cityAndZipCode: String;
};
export default function HeaderAddress({
  propertyStreet,
  cityAndZipCode,
}: Props) {
  return (
    <View className="w-full text-left">
      <Text
        className="line-clamp-1 w-[68vw]"
        style={{ fontSize: 18, fontWeight: "500", marginLeft: 3 }}
      >
        {propertyStreet}
      </Text>
      <Text
        className="line-clamp-1 w-[68vw]"
        style={{ fontSize: 14, color: "#808080" }}
      >
        {cityAndZipCode}
      </Text>
    </View>
  );
}
