import { Document } from 'mongoose';

export interface SiteMongoI extends Document {
  name: string;
  address: {
    street: string;
    town: string;
    state: string;
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
    instagram: string;
    youtube: string;
    email: string;
  };
}

export interface SiteI extends SiteMongoI {
  _id?: string;
  created?: string;
  updated?: string;
}

export interface SiteForMapI {
  slug: string;
  name: string;
  image: any;
  address: any;
  type: string;
}
