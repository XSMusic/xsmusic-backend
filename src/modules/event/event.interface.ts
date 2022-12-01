import { Document } from 'mongoose';

export interface EventMongoI extends Document {
  name: string;
  date: string;
  styles: any[];
  site: any;
  artists: any[];
  info: string;
  slug: string;
}

export interface EventI {
  _id?: string;
  name: string;
  date: string;
  styles: any[];
  site: any;
  artists: any[];
  info: string;
  slug: string;
  created?: string;
  updated?: string;
}
