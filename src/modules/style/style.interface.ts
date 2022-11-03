import { Document } from 'mongoose';

export interface StyleMongoI extends Document {
  name: string;
  colors: {
    bg: string;
    text: string;
  };
}

export interface StyleI extends StyleMongoI {
  _id?: string;
  created?: string;
  updated?: string;
}
