import mongoose from 'mongoose';

export interface ImageI {
  _id?: string;
  type: any; // car | tournament
  car?: any; // TournamentI
  tournament?: any; // TournamentI
  brand?: any;
  url: string;
  firstImage?: boolean;
  position?: number;
  size?: string;
  created?: string;
  updated?: string;
}

export interface ImageMongoI extends mongoose.Document {
  _id?: string;
  type: any; // car | tournament
  car?: any; // TournamentI
  tournament?: any; // TournamentI
  brand?: any;
  url: string;
  firstImage?: boolean;
  position?: number;
  created?: string;
  updated?: string;
}
