import { Document } from 'mongoose';

export interface ImageMongoI extends Document {
  type: any;
  artist?: any;
  media?: any;
  site?: any;
  event?: any;
  user?: any;
  url: string;
  firstImage?: boolean;
  position?: number;
  size?: string;
  created?: string;
  updated?: string;
}

export interface ImageI {
  _id?: string;
  type: any;
  artist?: any;
  media?: any;
  site?: any;
  event?: any;
  user?: any;
  url: string;
  firstImage?: boolean;
  position?: number;
  size?: string;
  created?: string;
  updated?: string;
}
