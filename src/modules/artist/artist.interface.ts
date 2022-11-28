import { ImageI } from '@image';
import { Document } from 'mongoose';

export interface ArtistMongoI extends Document {
  name: string;
  birthdate: string;
  country: string;
  gender: string;
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
    mixcloud: string;
    youtube: string;
  };
}

export interface ArtistI {
  _id?: string;
  name: string;
  birthdate: string;
  country: string;
  gender: string;
  styles: any[];
  info: string;
  slug: string;
  images?: ImageI[];
  social: {
    web: string;
    facebook: string;
    twitter: string;
    spotify: string;
    soundcloud: string;
    tiktok: string;
    instagram: string;
    mixcloud: string;
    youtube: string;
  };
  created?: string;
  updated?: string;
}
