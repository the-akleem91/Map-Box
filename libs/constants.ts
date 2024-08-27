import type { MaterialType } from "@/types/inspection";

export const BASE_API_URL = process.env.EXPO_PUBLIC_BASE_URL + "/api";

export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const REACT_NATIVE_MAP_STYLE = "satellite";

export const MAPBOX_ACCESS_TOKEN = process.env.MAP_BOX_API;

export enum INSPECTION_STATUS {
  NO_IMAGES = "no images", // was empty before
  READY_FOR_ACTION = "ready for action", // partial
  PROCESSING = "processing",
  READY = "ready", // complete
}


export const DEFAULT_DATE_FORMAT_WITH_TIME = "MMM DD, YYYY - hh:mm a";
export const DEFAULT_DATE_FORMAT = "MMM DD, YYYY";

export const MATERIALS = [
  {
    name: "IKO - Cambridge",
    type: "Shingle",
    unit: "Bundle",
    coveragePerUnit: 33.3,
    measurementUnit: "sqft",
  },
  {
    name: "CertainTeed - Landmark",
    type: "Shingle",
    unit: "Bundle",
    coveragePerUnit: 33.3,
    measurementUnit: "sqft",
  },
  {
    name: "GAF - Timberline",
    type: "Shingle",
    unit: "Bundle",
    coveragePerUnit: 32.81,
    measurementUnit: "sqft",
  },
  {
    name: "Owens Corning - Duration",
    type: "Shingle",
    unit: "Bundle",
    coveragePerUnit: 32.81,
    measurementUnit: "sqft",
  },
  {
    name: "Atlas - Pristine",
    type: "Shingle",
    unit: "Bundle",
    coveragePerUnit: 33.25,
    measurementUnit: "sqft",
  },
  {
    name: "IKO - Leading Edge Plus",
    type: "Starter",
    unit: "Bundle",
    coveragePerUnit: 123.0,
    measurementUnit: "ft",
  },
  {
    name: "CertainTeed - SwiftStart",
    type: "Starter",
    unit: "Bundle",
    coveragePerUnit: 116.25,
    measurementUnit: "ft",
  },
  {
    name: "GAF - Pro-Start",
    type: "Starter",
    unit: "Bundle",
    coveragePerUnit: 120.33,
    measurementUnit: "ft",
  },
  {
    name: "Owens Corning - Starter Strip",
    type: "Starter",
    unit: "Bundle",
    coveragePerUnit: 105.0,
    measurementUnit: "ft",
  },
  {
    name: "Atlas - Pro-cut Starter Shingles",
    type: "Starter",
    unit: "Bundle",
    coveragePerUnit: 78.0,
    measurementUnit: "ft",
  },
  {
    name: "IKO - StormShield",
    type: "Ice",
    unit: "Roll",
    coveragePerUnit: 65,
    measurementUnit: "ft",
  },
  {
    name: "CertainTeed - WinterGuard",
    type: "Ice",
    unit: "Roll",
    coveragePerUnit: 65,
    measurementUnit: "ft",
  },
  {
    name: "GAF - WeatherWatch",
    type: "Ice",
    unit: "Roll",
    coveragePerUnit: 66.7,
    measurementUnit: "ft",
    pricePerUnit: 32,
  },
  {
    name: "Owens Corning - WeatherLock G",
    type: "Ice",
    unit: "Roll",
    coveragePerUnit: 66.7,
    measurementUnit: "ft",
  },
  {
    name: "Atlas - Weathermaster",
    type: "Ice",
    unit: "Roll",
    coveragePerUnit: 65.0,
    measurementUnit: "ft",
  },
  {
    name: "IKO - Stormtite",
    type: "Underlayment",
    unit: "Roll",
    coveragePerUnit: 1000,
    measurementUnit: "sqft",
  },
  {
    name: "CertainTeed - RoofRunner",
    type: "Underlayment",
    unit: "Roll",
    coveragePerUnit: 937.5,
    measurementUnit: "sqft",
  },
  {
    name: "GAF - Deck-Armor",
    type: "Underlayment",
    unit: "Roll",
    coveragePerUnit: 1000,
    measurementUnit: "sqft",
  },
  {
    name: "Owens Corning - RhinoRoof",
    type: "Underlayment",
    unit: "Roll",
    coveragePerUnit: 999.02,
    measurementUnit: "sqft",
  },
  {
    name: "Atlas - Summit",
    type: "Underlayment",
    unit: "Roll",
    coveragePerUnit: 1000,
    measurementUnit: "sqft",
  },
  {
    name: "IKO - Hip and Ridge",
    type: "Capping",
    unit: "Bundle",
    coveragePerUnit: 36.5,
    measurementUnit: "ft",
  },
  {
    name: "CertainTeed - Shadow Ridge (English)",
    type: "Capping",
    unit: "Bundle",
    coveragePerUnit: 30.0,
    measurementUnit: "ft",
  },
  {
    name: "GAF - Seal-A-Ridge",
    type: "Capping",
    unit: "Bundle",
    coveragePerUnit: 25,
    measurementUnit: "ft",
  },
  {
    name: "Owens Corning - DecoRidge",
    type: "Capping",
    unit: "Bundle",
    coveragePerUnit: 20,
    measurementUnit: "ft",
  },
  {
    name: "Atlas - Pro-Cut H&R",
    type: "Capping",
    unit: "Bundle",
    coveragePerUnit: 31,
    measurementUnit: "ft",
  },
  {
    name: "8' Sheets",
    type: "Misc 1 - Valley Gutter Sheets",
    unit: "Sheet",
    coveragePerUnit: 8,
    measurementUnit: "ft",
  },
  {
    name: "10' Sheets",
    type: "Misc 2 - Drip Edge",
    unit: "Sheet",
    coveragePerUnit: 10,
    measurementUnit: "ft",
  },
] as MaterialType[];

export const REPORT_STRIPE_PRICE_IDS: Record<
  string,
  { paid: string; free: string }
> = {
  "Measurements Report": {
    paid: process.env.EXPO_PUBLIC_MEASUREMENT_REPORT_PAID_PRICE_ID || "",
    free: process.env.EXPO_PUBLIC_MEASUREMENT_REPORT_FREE_PRICE_ID || "",
  },
  "Weather Report": {
    paid: process.env.EXPO_PUBLIC_WEATHER_REPORT_PAID_PRICE_ID || "",
    free: process.env.EXPO_PUBLIC_WEATHER_REPORT_FREE_PRICE_ID || "",
  },
  "Proof-of-Loss Report": {
    paid: process.env.EXPO_PUBLIC_PROOF_OF_LOSS_REPORT_PAID_PRICE_ID || "",
    free: process.env.EXPO_PUBLIC_PROOF_OF_LOSS_REPORT_FREE_PRICE_ID || "",
  },
};
