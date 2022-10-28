import { Document } from 'mongoose';

export interface ArtistMongoI extends Document {
  name: string;
  birthdate: string;
  country: string;
  image: string;
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
  };
}

export interface ArtistI extends ArtistMongoI {
  _id?: string;
  created?: string;
  updated?: string;
}
