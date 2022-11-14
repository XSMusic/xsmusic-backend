import { Document } from 'mongoose';

export interface MediaMongoI extends Document {
  name: string;
  artists: any[];
  site: any;
  type: string;
  styles: any[];
  info: string;
  source: string;
  sourceId: string;
  year: number;
  slug: string;
}

export interface MediaI extends MediaMongoI {
  _id?: string;
  created?: string;
  updated?: string;
}
