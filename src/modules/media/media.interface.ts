import { Document } from 'mongoose';

export interface MediaMongoI extends Document {
  name: string;
  artists: any[];
  type: string; // set - track
  image: string;
  styles: any[];
  info: string;
  source: string; // Youtube...
}

export interface MediaI extends MediaMongoI {
  _id?: string;
  created?: string;
  updated?: string;
}
