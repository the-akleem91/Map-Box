import {
  type Feature,
  type FeatureCollection,
  type Geometry,
  type LineString,
} from "geojson";
import { type Model, model, models, Schema } from "mongoose";

import { MATERIALS } from "@/libs/constants";

// import { z } from "zod";
import { type PropertyType } from "./property";
import { type BaseTimestamp } from "./user";

export interface RoofOverviewType extends BaseTimestamp {
  createdBy: string; // annotator or roofer id
  "PRIMARY ROOF SHAPE": string;
  "NUMBER OF SLOPES": number;
  "SHINGLE TYPE": string;
  "SHINGLE DESIGN": string;
  "SHINGLE COLOR": string;
  "SOLAR PANELS": string;
  "NUMBER OF CHIMNEYS": number;
  "NUMBER OF AIR VENTS": number;
  "NUMBER OF PLUMBING VENTS": number;
  "NUMBER OF DORMERS": number;
  "NUMBER OF SKYLIGHTS": number;
  "PREDOMINANT PITCH": string;
}

export interface ReportType extends BaseTimestamp {
  id: string;
  inspectionId: string;
  // type: string;
  name: string;
  url?: string;
  privateUrl?: string;
  verified: boolean;
  verifiedBy?: string;
}

export interface FeatureProperties {
  id: string;
  type?: string;
  edges?: string[];
  edgeTypes?: string[];
  lines?: Feature<LineString, FeatureProperties>[]; // only for pitch direction calculation
  nodes?: string[];
  length?: {
    text: string;
    feet: number;
    inch: number;
    ft: number;
  };
  flatArea?: number;
  slope?: number | null;
  slopeDirection?: number[] | null;
  properties?: string[];
  shouldExcludeArea?: boolean;
  hasExcludedFacet?: boolean;
  Theta?: number;
  area?: number;
}

export interface MeasurementsType extends BaseTimestamp {
  isSubmitted: boolean;
  layers: number[];
  geojson: FeatureCollection<Geometry, FeatureProperties>;
  createdBy?: string;
  theta?: number;
}

export interface MaterialType extends BaseTimestamp {
  id?: string;
  name: string;
  enabled: boolean;
  unit: string; /// bundle or roll
  type: string;
  coveragePerUnit: number;
  measurementUnit: string;
  pricePerUnit?: number | null;
  wastage: number;
}

export interface Policy {
  policyNumber?: string;
  amount?: string;
  dateIssued?: string;
  expirationDate?: string;
  insuranceCompany?: string;
  propertyValue?: string;
}

export interface HomeOwnerInfo {
  ownerName?: string;
  phoneNumber?: string;
  email?: string;
}

export interface InspectionType extends BaseTimestamp {
  id: string;
  owner: string; // The orgId
  property: PropertyType;
  structureId: string;
  slackThreadTs: string;
  status: string;
  statusMessage: string;
  tags?: Array<string>;
  imageCount: number;
  inspectionNumber?: number;
  isImagesUploaded?: boolean; // TODO: should be removed
  generatedReports?: Array<string>;
  resultsViewed?: boolean;
  isImageGeoRegistering?: boolean; // TODO: should be removed
  selectedImages?: Array<string>; // TODO: should be removed
  roofFootPrint?: string;
  roofAge?: string;
  inspectionDate?: string;
  annotatorRoofOverview?: RoofOverviewType;
  userRoofOverview?: RoofOverviewType;
  measurements?: MeasurementsType;
  measurementReport?: ReportType;
  proofOfLossReport?: ReportType;
  weatherReport?: ReportType;
  customReport?: ReportType;
  propertySightStatus?: "notStarted" | "inProgress" | "failed" | "complete";
  shinglePrelimStatus?: "notStarted" | "inProgress" | "failed" | "complete";
  penetrationInfoStatus?: "notStarted" | "inProgress" | "failed" | "complete";
  fixtureInfoStatus?: "notStarted" | "inProgress" | "failed" | "complete";
  shingleInfoStatus?: "notStarted" | "inProgress" | "failed" | "complete";
  shingleInfoUpdatedAt?: string;
  fixtureInfoUpdatedAt?: string;
  penetrationInfoUpdatedAt?: string;
  shinglePrelimUpdatedAt?: string;
  propertySightUpdatedAt?: string;
  materials: Array<MaterialType>;
  dateOfLoss: string;
  policy: Policy;
  homeOwnerInfo: HomeOwnerInfo;
}

const roofOverviewSchema = new Schema<RoofOverviewType>({
  createdBy: {
    type: String,
    required: true,
  },
  "PRIMARY ROOF SHAPE": {
    type: String,
    required: false,
  },
  "NUMBER OF SLOPES": {
    type: Number,
    required: false,
  },
  "SHINGLE TYPE": {
    type: String,
    required: false,
  },
  "SHINGLE DESIGN": {
    type: String,
    required: false,
  },
  "SHINGLE COLOR": {
    type: String,
    required: false,
  },
  "SOLAR PANELS": {
    type: String,
    required: false,
  },
  "NUMBER OF CHIMNEYS": {
    type: Number,
    required: false,
  },
  "NUMBER OF AIR VENTS": {
    type: Number,
    required: false,
  },
  "NUMBER OF PLUMBING VENTS": {
    type: Number,
    required: false,
  },
  "NUMBER OF DORMERS": {
    type: Number,
    required: false,
  },
  "NUMBER OF SKYLIGHTS": {
    type: Number,
    required: false,
  },
  "PREDOMINANT PITCH": {
    type: String,
    required: false,
  },
});

const reportSchema = new Schema<ReportType>(
  {
    name: {
      type: String,
      required: false,
    },
    url: { type: String, required: false },
    privateUrl: {
      type: String,
      required: false,
    },
    verified: { type: Boolean, default: false },
    verifiedBy: { type: String, required: false },
  },
  { timestamps: true }
);

const materialsSchema = new Schema<MaterialType>(
  {
    name: String,
    enabled: { type: Boolean, required: false, default: false },
    unit: String,
    type: String,
    coveragePerUnit: Number,
    measurementUnit: String,
    pricePerUnit: { type: Number, required: false, default: null },
    wastage: { type: Number, required: false },
  },
  { timestamps: true }
);

const measurementsSchema = new Schema<MeasurementsType>({
  createdBy: String,
  geojson: Map,
  isSubmitted: { type: Boolean, required: false },
  layers: { type: [Number], required: false, default: [1] },
  theta: { type: Number, required: false, default: 0 },
});

const policySchema = new Schema<Policy>({
  policyNumber: { type: String, required: false },
  amount: { type: String, required: false },
  dateIssued: { type: String, required: false },
  expirationDate: { type: String, required: false },
  insuranceCompany: { type: String, required: false },
  propertyValue: { type: String, required: false },
});

const homeOwnerInfoSchema = new Schema<HomeOwnerInfo>({
  ownerName: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  email: { type: String, required: false },
});

export const InspectionSchema = new Schema<
  InspectionType & { propertyId: Schema.Types.ObjectId }
>(
  {
    owner: {
      type: String,
      required: true,
      default: "anonymous",
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
    },
    structureId: String,
    tags: { type: [String], required: false, default: [] },
    status: String,
    statusMessage: {
      type: String,
      required: false,
      default: "",
    },
    inspectionNumber: {
      type: Number,
      required: false,
    },
    imageCount: { type: Number, required: false, default: 0 },
    resultsViewed: { type: Boolean, required: false },
    isImageGeoRegistering: { type: Boolean, required: false },
    isImagesUploaded: { type: Boolean, required: false },
    selectedImages: { type: [String], required: false },
    generatedReports: { type: [String], required: false, default: [] },
    roofFootPrint: { type: String, required: false },
    roofAge: { type: String, required: false },
    inspectionDate: { type: String, required: false },
    annotatorRoofOverview: { type: roofOverviewSchema, required: false },
    userRoofOverview: { type: roofOverviewSchema, required: false },
    measurements: {
      type: measurementsSchema,
      required: false,
      // default: { geojson: {}, isSubmitted: false },
    },
    measurementReport: { type: reportSchema, required: false },
    proofOfLossReport: { type: reportSchema, required: false },
    weatherReport: { type: reportSchema, required: false },
    customReport: { type: reportSchema, required: false },
    materials: { type: [materialsSchema], required: false, default: MATERIALS },
    shinglePrelimStatus: {
      type: String,
      required: false,
      default: "notStarted",
    },
    propertySightStatus: {
      type: String,
      required: false,
      default: "notStarted",
    },
    shinglePrelimUpdatedAt: {
      type: String,
      required: false,
    },
    propertySightUpdatedAt: {
      type: String,
      required: false,
    },
    shingleInfoUpdatedAt: {
      type: String,
      required: false,
    },
    fixtureInfoUpdatedAt: {
      type: String,
      required: false,
    },
    fixtureInfoStatus: {
      type: String,
      required: false,
      default: "notStarted",
    },
    shingleInfoStatus: {
      type: String,
      required: false,
      default: "notStarted",
    },
    dateOfLoss: { type: String, required: false },
    policy: { type: policySchema, required: false },
    homeOwnerInfo: { type: homeOwnerInfoSchema, required: false },
  },
  { timestamps: true }
);

export const Inspection: Model<InspectionType> =
  models?.Inspection || model<InspectionType>("Inspection");

// export const inspectionCreateValidation = z.object({
//   owner: z.string().optional(),
//   propertyId: z.string().optional(),
//   status: z.string().optional(),
//   tags: z.array(z.string()).optional(),
//   structureId: z.string().optional(),
// });

// export const roofOverviewUpdateValidation = z.object({
//   createdBy: z.string(),
//   "PRIMARY ROOF SHAPE": z.string().optional(),
//   "NUMBER OF SLOPES": z.number().optional(),
//   "SHINGLE TYPE": z.string().optional(),
//   "SHINGLE DESIGN": z.string().optional(),
//   "SHINGLE COLOR": z.string().optional(),
//   "SOLAR PANELS": z.string().optional(),
//   "NUMBER OF CHIMNEYS": z.number().optional(),
//   "NUMBER OF AIR VENTS": z.number().optional(),
//   "NUMBER OF PLUMBING VENTS": z.number().optional(),
//   "NUMBER OF DORMERS": z.number().optional(),
//   "NUMBER OF SKYLIGHTS": z.number().optional(),
//   "PREDOMINANT PITCH": z.string().optional(),
// });

// export const reportCreateValidation = z.object({
//   inspectionId: z.string().optional(), // for IAP-API
//   type: z.string().optional(), // for IAP-API
//   name: z.string().optional(),
//   url: z.string().optional(),
//   privateUrl: z.string().optional(),
//   verified: z.boolean().optional(),
//   verifiedBy: z.string().optional(),
// });

// export const measurementsValidation = z.object({
//   createdBy: z.string().optional(),
//   geojson: z.object({
//     type: z.literal("FeatureCollection"),
//     features: z.array(z.record(z.any())),
//   }),
//   isSubmitted: z.boolean().optional(),
//   layers: z.array(z.number()).optional(),
//   theta: z.number().optional(),
// });

// export const materialsUpdateValidation = z.array(
//   z.object({
//     id: z.string().optional(),
//     name: z.string().optional(),
//     enabled: z.boolean().optional(),
//     unit: z.string().optional(),
//     type: z.string().optional(),
//     coveragePerUnit: z.number().optional(),
//     measurementUnit: z.string().optional(),
//     pricePerUnit: z.number().nullable().optional(),
//     wastage: z.number().optional(),
//   })
// );

// const policyValidation = z.object({
//   policyNumber: z.string().optional(),
//   amount: z.string().optional(),
//   dateIssued: z.string().optional(),
//   expirationDate: z.string().optional(),
//   insuranceCompany: z.string().optional(),
//   propertyValue: z.string().optional(),
// });

// const homeOwnerInfoValidation = z.object({
//   ownerName: z.string().optional(),
//   phoneNumber: z.string().optional(),
//   email: z.string().optional(),
// });

// export const inspectionUpdateValidation = z.object({
//   id: z.string(),
//   owner: z.string().optional(),
//   propertyId: z.string().optional(),
//   resultsViewed: z.boolean().optional(),
//   isImageGeoRegistering: z.boolean().optional(),
//   selectedImages: z.array(z.string()).optional(),
//   generatedReports: z.array(z.string()).optional(),
//   roofFootPrint: z.string().optional(),
//   roofAge: z.string().optional(),
//   inspectionDate: z.string().optional(),
//   status: z.string().optional(),
//   imageCount: z.number().optional(),
//   statusMessage: z.string().optional(),
//   annotatorRoofOverview: roofOverviewUpdateValidation.optional(),
//   userRoofOverview: roofOverviewUpdateValidation.optional(),
//   measurements: measurementsValidation.optional(),
//   measurementReport: reportCreateValidation.optional(),
//   proofOfLossReport: reportCreateValidation.optional(),
//   weatherReport: reportCreateValidation.optional(),
//   customReport: reportCreateValidation.optional(),
//   materials: materialsUpdateValidation.optional(),
//   dateOfLoss: z.string().optional(),
//   policy: policyValidation.optional(),
//   homeOwnerInfo: homeOwnerInfoValidation.optional(),
// });
