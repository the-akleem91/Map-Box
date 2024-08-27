import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import ParcelMap from "@/components/CreateInspection/Map/ParcelMap";
import HeaderAddress from "@/components/Inspection/HeaderAddress";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAddressAutoComplete } from "@/hooks/useAddressAutoComplete";
import { commonContainer } from "@/libs/commonStyles";

const CreateInspection = () => {
  const [field, setField] = useState("");
  const [Feature, setFeature] = useState<any>([]);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
  const { feature, RenderSuggestions, setShowSuggestion } =
    useAddressAutoComplete(field);
  const navigation = useNavigation();

  useEffect(() => {
    if (feature) {
      setField(feature?.place_name);
    }
  }, [feature]);

  const place = feature?.place_name;
  const address = place?.property?.address;
  const propertyAddress = address?.split(",");
  const propertyStreet = propertyAddress ? propertyAddress[0] : "";
  const cityAndZipCode = propertyAddress
    ?.slice(1, propertyAddress.length)
    .filter((item: string) => item !== " United States")
    .join(", ");

  // Render Header Title Bases on Steps

  function handleStartInspection() {
    if (!field || !feature) return;
    setFeature(feature);
    setIsAddressConfirmed(true);
  }

  function handleChangeAddress() {
    setIsAddressConfirmed(false);
    setFeature([]);
    setField("");
  }

  navigation.setOptions({
    // eslint-disable-next-line react/no-unstable-nested-components
    headerTitle: () => {
      return isAddressConfirmed ? (
        <HeaderAddress
          propertyStreet={propertyStreet}
          cityAndZipCode={cityAndZipCode}
        />
      ) : (
        <Text style={{ fontSize: 20, fontWeight: "600" }}>
          Create Inspection
        </Text>
      );
    },
    headerStatusBarHeight: 8,
  });
  return (
    <View>
      <View style={{ ...commonContainer.container }}>
        <View className="relative justify-center gap-2">
          <Text className="ml-1 text-2xl font-medium">Address</Text>
          <Text className="ml-1 text-gray-500">
            Enter the address of the property
          </Text>
          <Input
            id="address"
            placeholder="Street, City, State, Zip Code, Country"
            value={field}
            onChangeText={(text) => setField(text)}
            onBlur={(e) =>
              setTimeout(() => {
                if (e.type === "blur") {
                  setShowSuggestion(false);
                }
              }, 200)
            }
            style={styles.input}
            editable={!isAddressConfirmed}
          />
        </View>
        <View
          style={{
            position: "absolute",
            top: "120%",
            width: "100%",
            zIndex: 50,
          }}
        >
          {RenderSuggestions()}
        </View>
      </View>

      <View style={{ height: "78%", position: "relative", zIndex: 30 }}>
        <ParcelMap
          feature={Feature}
          handleChangeAddress={handleChangeAddress}
          isAddressConfirmed={isAddressConfirmed}
        />
        {!isAddressConfirmed && feature && (
          <Button
            title="Confirm Address"
            style={{
              position: "absolute",
              zIndex: 60,
              borderRadius: 999,
              width: "90%",
              bottom: 20,
              marginHorizontal: 16,
            }}
            disabled={!field}
            onPress={handleStartInspection}
          />
        )}
      </View>
    </View>
  );
};

export default CreateInspection;

const styles = StyleSheet.create({
  welcomeText: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "500",
  },
  brandText: {
    color: "#4F46E5",
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    height: 300,
    width: 300,
  },

  input: {
    backgroundColor: "white",
    opacity: 1,
    color: "#101010",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    fontWeight: "semibold",
    elevation: 2,
  },
  map: {
    flex: 1,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 999,
    elevation: 2,
    marginTop: 8,
  },
});
