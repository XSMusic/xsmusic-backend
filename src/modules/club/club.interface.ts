import { Document } from 'mongoose';

export interface ClubMongoI extends Document {
  name: string;
  address: {
    city: string;
    country: string;
    coordinates: number[];
  };
  image: string;
  styles: any[];
  info: string;
  slug: string;
  social: {
    web: string;
    facebook: string;
    twitter: string;
    spotify: string;
    soundcloud: string;
    tiktok: string;
    instagram: string;
    email: string;
  };
}

export interface ClubI extends ClubMongoI {
  _id?: string;
  created?: string;
  updated?: string;
}
