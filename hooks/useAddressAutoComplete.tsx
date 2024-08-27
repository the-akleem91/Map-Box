import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { MAPBOX_ACCESS_TOKEN } from "@/libs/constants";

import { useDebounce } from "./useDebounce"; // Ensure this path is correct

export const useAddressAutoComplete = (address: string) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [feature, setFeature] = useState<any>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);

  const debouncedSearch = useDebounce(address);

  useEffect(() => {
    if (
      debouncedSearch &&
      !suggestions.find((feature) => feature.place_name === debouncedSearch)
    ) {
      getSuggestions(debouncedSearch);
    }
  }, [debouncedSearch]);

  // Clean up suggestions when the address is cleared
  useEffect(() => {
    if (!address && suggestions.length > 0) {
      setSuggestions([]);
      setFeature(null);
    }
  }, [address, suggestions]);

  const getSuggestions = (address: string) => {
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json`,
        {
          params: {
            access_token: MAPBOX_ACCESS_TOKEN,
            country: "US", // Limit the search to the United States
            limit: 10, // Limit the number of suggestions
          },
        }
      )
      .then((response) => {
        const suggestions = response?.data?.features;
        setSuggestions(suggestions || []);
        setShowSuggestion(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSuggestionClick = (suggestion: Record<string, any>) => {
    setFeature(suggestion);
    setShowSuggestion(false);
  };

  const RenderSuggestions = () => {
    return showSuggestion && suggestions.length > 0 ? (
      <View className="my-1 ml-3 max-h-56 w-full rounded-lg border border-gray-200 bg-white py-1">
        <ScrollView>
          {suggestions?.map((feature, index) => {
            const address = feature.place_name.split(",");
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleSuggestionClick(feature)}
                style={styles.suggestion}
              >
                <Ionicons
                  name="location"
                  size={24}
                  color="#4A5568"
                  style={styles.icon}
                />
                <View>
                  <Text style={styles.addressTitle}>{address[0]}</Text>
                  <Text style={styles.addressDetails}>
                    {address.slice(1).join(", ")}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    ) : null;
  };

  return {
    RenderSuggestions,
    setFeature,
    feature,
    setShowSuggestion,
    showSuggestion,
  };
};

const styles = StyleSheet.create({
  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "white",
  },
  icon: {
    marginRight: 8,
  },
  addressTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  addressDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    fontSize: 12,
    color: "#4A5568",
  },
});
