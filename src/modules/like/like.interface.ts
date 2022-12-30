import { Document } from 'mongoose';

export interface LikeMongoI extends Document {
  type: string;
  subType: string;
  artist?: any;
  event?: any;
  media?: any;
  site?: any;
  user: any;
}

export interface LikeI {
  _id?: string;
  type: string;
  subType: string;
  artist?: any;
  event?: any;
  media?: any;
  site?: any;
  user: any;
  created?: string;
  updated?: string;
}
