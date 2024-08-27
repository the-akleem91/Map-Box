import { type Feature, type GeoJsonProperties, type Geometry } from "geojson";

import type { BaseTimestamp } from "./user";

export type Structure = {
  id?: string;
  name: string;
  bbox?: number[];
  previewUrl?: string;
  geometry?: Feature<Geometry, GeoJsonProperties>;
  roofFootPrint?: string;
  roofAge?: string;
  inspectionDate?: string;
  propertyType?: string;
};

export interface PropertyType extends BaseTimestamp {
  id: string;
  owner: string;
  address: string;
  description?: string;
  status?: string;
  tags?: Array<string>;
  structures?: Array<Structure>;
  coordinates?: [number, number];
  metadata?: Record<string, any>;
}
