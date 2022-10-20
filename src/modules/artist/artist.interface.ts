import { Document } from "mongoose";

export interface ArtistMongoI extends Document {
  name: string;
  birthdate: string;
  country: string;
  image: string;
  gender: string;
  styles: string[];
  info: string;
  slug: string;
}

export interface ArtistI extends ArtistMongoI {
  _id?: string;
  created?: string;
  updated?: string;
}
