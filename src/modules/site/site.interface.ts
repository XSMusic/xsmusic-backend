import { Document } from 'mongoose';

export interface SiteMongoI extends Document {
  name: string;
  address: {
    street: string;
    city: string;
    poblation: string;
    country: string;
    coordinates: number[];
  };
  type: string;
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

export interface SiteI extends SiteMongoI {
  _id?: string;
  created?: string;
  updated?: string;
}
