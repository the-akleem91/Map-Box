import type { BaseTimestamp } from "./user";

export interface ImageType extends BaseTimestamp {
  id: string;
  name: string;
  tags: [];
  bbox?: Array<number>; // UI only, to satisfy the type checker
  status: string; // available or not available
  inspectionId: string;
  imageUrl: string;
  publicUrl?: string; // UI only, to satisfy the type checker
  thumbnail: string; // base64 256x256
  imageOrientation?: string;
  imageOrientationBy?: string;
  selected: boolean;
  selectedBy: string;
  shinglePrelimBoxes?: Array<Array<number>>; // [[X,Y,W,H], ...], // Should change to shinglePrelimBoxes
  shinglePrelimGood?: boolean;
  shinglePrelimGoodBy?: string;
  propertySight?: Record<string, any>;
  userPropertySight?: Record<string, any>;
  rooferNotes?: Record<string, any>;
  shingleInfo?: Array<Array<number | string>>; // [[x1 y1 x2 y2 x3 y3 ... label], ...]
  shingleInfoBy?: string;
  fixtureInfo?: Array<Array<number | string>>; // [[x1 y1 x2 y2 x3 y3 ... label], ...]
  fixtureInfoBy?: string;
  penetrationInfo?: Array<Array<number | string>>; // [[x1 y1 x2 y2 x3 y3 ... label], ...]
  penetrationInfoBy?: string;
  markupsInfo: Array<Array<number | string>>; // [[x1 y1 x2 y2 x3 y3 ... label], ...]
  markupsInfoBy?: string;
  miscellaneousInfo?: Array<Array<number | string>>; // [[x1 y1 x2 y2 x3 y3 ... label], ...]
  miscellaneousInfoBy?: string;
  satelliteImage?: boolean;
  mimeType?: string; // to render thumbnail
  overviewImage?: boolean; // Default image for overview tab and reports
}

export interface PaginatedImageType {
  pages?: number;
  perPage?: number;
  total?: number;
  results: ImageType[];
}
