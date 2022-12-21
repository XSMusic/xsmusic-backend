import { ImageI } from '@image';
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
    ra: string;
  };
}

export interface SiteI extends SiteMongoI {
  _id?: string;
  name: string;
  address: {
    street: string;
    town: string;
    state: string;
    country: string;
    coordinates: number[];
  };
  type: string;
  images?: ImageI[];
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
    ra: string;
  };
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
