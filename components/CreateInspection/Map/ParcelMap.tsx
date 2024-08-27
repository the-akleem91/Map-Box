import { AntDesign, Feather, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAnalytics } from "@segment/analytics-react-native";
import { bbox, buffer, distance, point } from "@turf/turf";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import type { GestureResponderEvent } from "react-native";
import { Pressable, View } from "react-native";
import MapView, { Polygon } from "react-native-maps";
import Toast from "react-native-root-toast";

import { queryClient } from "@/api/apiProvider";
import { useCreateInspection } from "@/api/useInspection";
import { useCreateProperty } from "@/api/useProperty";
import AddBoxMessage from "@/components/Inspection/createInspection/AddBoxMessage";
import { useSession } from "@/contexts/authProvider";
import { BASE_API_URL, REACT_NATIVE_MAP_STYLE } from "@/libs/constants";
import { ErrorMessageStyle, SuccessMessageStyle } from "@/libs/ToastStyles";
import type { SelectedPolygon } from "@/types/parcelMap";

import Button from "../../ui/Button";
import RenderPolygon from "./RenderPolygon";

const initialCoordinates = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
];

type Props = {
  feature: any;
  handleChangeAddress?: any;
  isAddressConfirmed: boolean;
};

function calculateBoundingBox(coords: any) {
  let minX = coords[0][0];
  let minY = coords[0][1];
  let maxX = coords[0][0];
  let maxY = coords[0][1];

  coords.forEach((coord: any[]) => {
    if (coord[0] < minX) minX = coord[0];
    if (coord[1] < minY) minY = coord[1];
    if (coord[0] > maxX) maxX = coord[0];
    if (coord[1] > maxY) maxY = coord[1];
  });

  return [minX, minY, maxX, maxY];
}

export default function ParcelMap({
  feature,
  handleChangeAddress,
  isAddressConfirmed,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [polygonCoordinates, setPolygonCoordinates] = useState<number[][][]>(
    []
  );
  const { session } = useSession();
  const [coordinates, setCoordinates] = useState(initialCoordinates);
  const [finalCoordinates, setFinalCoordinates] = useState<number[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [clickedPointIndex, setClickedPointIndex] = useState(-1);
  const [updatedCoordinates, setUpdatedCoordinates] = useState<number[]>([]);
  const [selectedPolygon, setSelectedPolygon] = useState<SelectedPolygon>({
    id: null,
    bbox: null,
  });

  const propertyCoordinates = feature?.center;

  const mapRef = useRef<MapView>(null);

  const { mutateAsync: createProperty } = useCreateProperty();
  const { mutateAsync: CreateInspection } = useCreateInspection();

  const { track } = useAnalytics();

  useEffect(() => {
    const fetchPolygons = async () => {
      if (propertyCoordinates?.length !== 2 || !feature) return;
      const pt = point(propertyCoordinates);

      const buffered = buffer(pt, 0.3); // Radius in km for approx 1q square km area

      // Calculate bounding box
      //@ts-ignore
      const [minX, minY, maxX, maxY] = bbox(buffered);
      const url = `https://api.granular.ai/parcel/api/v1/building/polygons_in_bbox?min_x=${minX}&min_y=${minY}&max_x=${maxX}&max_y=${maxY}`;
      try {
        const response = await axios.get(url);
        if (response.data) {
          const allCoordinates = response?.data.map(
            (feature: { geometry: { coordinates: any[] } }) =>
              feature.geometry.coordinates[0]
          );
          setPolygonCoordinates(allCoordinates);
        }
      } catch (error) {
        console.error("Error fetching polygons:", error);
      }
    };

    fetchPolygons();
  }, [feature]);

  async function handleMapMovement(e: GestureResponderEvent) {
    if (!isDrawing) return;

    const clickCoordinate = await mapRef.current?.coordinateForPoint({
      x: e.nativeEvent?.locationX,
      y: e.nativeEvent?.locationY,
    });

    if (!clickCoordinate) return;

    if (finalCoordinates.length === 0) {
      if (coordinates[0][0] === 0 && coordinates[0][1] === 0) {
        setCoordinates((prev) => {
          const coords = [...prev];
          coords[0] = [clickCoordinate.longitude, clickCoordinate.latitude];
          return coords;
        });
      } else if (coordinates[0][0] !== 0 && coordinates[0][1] !== 0) {
        const thirdPoint = [
          clickCoordinate.longitude,
          clickCoordinate.latitude,
        ];

        const [lng, lat] = thirdPoint;

        const firstPoint = coordinates[0];
        const firstPointLng = firstPoint[0];
        const firstPointLat = firstPoint[1];
        const secondPoint = [firstPointLng, lat];
        const fourthPoint = [lng, firstPointLat];

        setCoordinates([firstPoint, secondPoint, thirdPoint, fourthPoint]);
      }
    } else {
      const threshold = 0.002;
      coordinates?.forEach((coordinate: any, index: number) => {
        const actualDistance = distance(
          [clickCoordinate?.longitude, clickCoordinate?.latitude],
          coordinate
        );

        if (actualDistance < threshold) {
          setClickedPointIndex(index);
          setUpdatedCoordinates([
            clickCoordinate?.longitude,
            clickCoordinate?.latitude,
          ]);
        }
      });
    }
  }

  function handleTouchEnd() {
    if (!isDrawing || coordinates.length === 0) return;

    if (finalCoordinates.length === 0) {
      if (coordinates !== initialCoordinates) {
        const firstCoordinates = coordinates[0];
        setFinalCoordinates([...coordinates, firstCoordinates]);

        setSelectedPolygon({
          id: coordinates.length,
          bbox: [...coordinates, firstCoordinates],
        });
      }
    } else {
      if (clickedPointIndex !== -1) {
        setCoordinates((prev) => {
          const newCoordinates = prev.map((point, index) => {
            if (index === clickedPointIndex) {
              return updatedCoordinates;
            }
            return point;
          });

          return newCoordinates;
        });
        const firstCordinate = coordinates[0];
        setFinalCoordinates([...coordinates, firstCordinate]);
      }
    }
  }

  function handleDeleteButton() {
    setFinalCoordinates([]);
    setCoordinates(initialCoordinates);
    setIsDrawing(false);
    setSelectedPolygon({ id: null, bbox: null });
  }

  async function handleSubmit() {
    const value = await AsyncStorage.getItem("userToken");
    const userToken = value && JSON.parse(value);

    try {
      const bbox = calculateBoundingBox(selectedPolygon?.bbox);

      const structure = {
        name: "Main Property",
        bbox: bbox,
        geometry: feature,
      };

      if (!feature?.place_name || !structure?.bbox) {
        throw new Error("Feature or bounding box not found");
      }

      setIsSubmitting(true);

      createProperty(
        {
          address: feature?.place_name,
          propertyType: "Residential Property",
          structures: [structure],
          coordinates: feature.center,
        },
        {
          async onSuccess(property) {
            const newStructure =
              property?.structures?.[property?.structures.length - 1];

            CreateInspection(
              {
                propertyId: property.id,
                structureId: newStructure?.id,
              },
              {
                async onSuccess(inspection) {
                  const orgId = session?.roles[0].id;

                  await axios.post(`${BASE_API_URL}/create-mapbox-image`, {
                    bbox: structure?.bbox,
                    inspectionId: inspection.id,
                    orgId: orgId,
                  });

                  setIsSubmitting(false);

                  Toast.show(
                    "Your inspection has been created successfully.",
                    SuccessMessageStyle
                  );

                  queryClient.invalidateQueries({
                    queryKey: ["inspections"],
                  });

                  router.replace(
                    `/inspection/${inspection.id}/orderReport?action=generate-report`
                  );
                },
              }
            ).catch((error) => {
              Toast.show(
                "Something went wrong. Please try again.",
                ErrorMessageStyle
              );
              track("Order Creation Failed", {
                email: userToken?.email,
                address: feature?.place_name,

                error: error.message,
              });
            });
          },
        }
      );
    } catch (error: any) {
      console.error(error.message);
      setIsSubmitting(false);

      // Optionally track the error
      track("Order Creation Failed", {
        email: userToken?.email,
        address: feature?.place_name,

        error: error.message,
      });
    }
  }

  function handleCompleteDrawing() {
    setPolygonCoordinates((prev: number[][][]) => {
      const newList = [...prev, coordinates];

      setSelectedPolygon({
        id: newList.length - 1,
        bbox: coordinates,
      });
      return [...prev, coordinates];
    });
    setFinalCoordinates([]);
    setCoordinates(initialCoordinates);

    setIsDrawing(false);
  }

  return (
    <View className="flex-1">
      <View className="relative flex-1">
        {isAddressConfirmed && <AddBoxMessage />}
        <MapView
          ref={mapRef}
          mapType={REACT_NATIVE_MAP_STYLE}
          style={{ flex: 1, zIndex: -2 }}
          scrollEnabled={!isDrawing}
          region={{
            longitude: propertyCoordinates ? propertyCoordinates[0] : -102.6,
            latitude: propertyCoordinates ? propertyCoordinates[1] : 37.5,
            latitudeDelta: propertyCoordinates ? 0.0005 : 0.1, // Adjusted for higher zoom level
            longitudeDelta: propertyCoordinates ? 0.0005 : 0.1,
          }}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleMapMovement}
        >
          <RenderPolygon
            polygonCoordinates={polygonCoordinates}
            isDrawing={isDrawing}
            selectedPolygon={selectedPolygon}
            setSelectedPolygon={setSelectedPolygon}
          />

          {/* Drawing Polygon */}
          <Polygon
            coordinates={coordinates?.map(([longitude, latitude]) => ({
              longitude,
              latitude,
            }))}
            strokeColor="rgb(50, 205, 50)"
            fillColor="rgba(50, 205, 50 , 0.2)"
            strokeWidth={3}
          />
        </MapView>

        <View className="absolute bottom-4 z-50 w-full flex-row items-center justify-between px-4 pb-4">
          {propertyCoordinates && (
            <Pressable
              onPress={() => {
                if (propertyCoordinates) {
                  setIsDrawing((state) => !state);
                }
              }}
              style={{
                backgroundColor: isDrawing ? "#4F46E5" : "white",
                borderRadius: 8,
              }}
            >
              <FontAwesome5
                name="draw-polygon"
                size={36}
                color="black"
                className="m-2 px-1 font-light"
                style={{ color: isDrawing ? "white" : "black" }}
              />
            </Pressable>
          )}
          {isDrawing && isAddressConfirmed && (
            <View className="flex-row gap-4 rounded-lg">
              <View className="flex-row gap-4 rounded-lg">
                <Pressable>
                  <Feather
                    name="x"
                    size={36}
                    color="black"
                    className="rounded-lg bg-white p-1"
                    onPress={handleDeleteButton}
                  />
                </Pressable>
              </View>

              {finalCoordinates.length !== 0 && (
                <View className="flex-row gap-4 rounded-lg">
                  <Pressable>
                    <AntDesign
                      name="check"
                      size={36}
                      color="green"
                      className="rounded-lg bg-white p-1"
                      onPress={handleCompleteDrawing}
                    />
                  </Pressable>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      {isAddressConfirmed && (
        <View className="w-full flex-row justify-between gap-2 px-2">
          <Button
            title="Back"
            onPress={() => {
              handleChangeAddress();
              setFinalCoordinates([]);
              setCoordinates(initialCoordinates);
              setIsDrawing(false);
              setSelectedPolygon({ id: null, bbox: null });
            }}
            className="m-2 w-[45%] rounded-full"
            variant="outline"
          />
          <Button
            title="Submit"
            isLoading={isSubmitting}
            onPress={() => handleSubmit()}
            disabled={!selectedPolygon.id || !selectedPolygon.bbox}
            className="m-2 w-[45%] rounded-full"
          />
        </View>
      )}
    </View>
  );
}
