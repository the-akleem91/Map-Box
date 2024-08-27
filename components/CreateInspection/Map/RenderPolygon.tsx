import React from "react";
import { Polygon } from "react-native-maps";

import type { RenderPolygonTypes } from "@/types/parcelMap";

export default function RenderPolygons({
  polygonCoordinates,
  isDrawing,
  selectedPolygon,
  setSelectedPolygon,
}: RenderPolygonTypes) {
  return polygonCoordinates?.map((polygon: any, index: number) => {
    if (polygon.length === 0) return;
    return (
      <Polygon
        key={index}
        coordinates={polygon?.map(
          ([longitude, latitude]: [longitude: number, latitude: number]) => ({
            longitude,
            latitude,
          })
        )}
        strokeColor={
          index === (selectedPolygon?.id as unknown as number)
            ? "rgb(50, 205, 50)"
            : "#5046E4"
        }
        fillColor={
          index === (selectedPolygon?.id as unknown as number)
            ? "rgba(50, 205, 50 , 0.2)"
            : "rgba(80, 70, 228, 0.5)"
        }
        strokeWidth={3}
        focusable={true}
        onPress={() => {
          if ((selectedPolygon?.id as unknown as number) === index) {
            setSelectedPolygon({
              id: null,
              bbox: null,
            });
          } else {
            setSelectedPolygon({
              id: index,
              bbox: polygon,
            });
          }
        }}
        tappable={!isDrawing}
      />
    );
  });
}
