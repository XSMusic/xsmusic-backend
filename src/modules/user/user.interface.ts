import * as mongoose from 'mongoose';

export interface UserMongoI extends mongoose.Document {
  email: string;
  name: string;
  role: string;
  country: string;
  image: string;
  darkMode: string;
  googleId?: string;
  appleId?: string;
  fcm?: string;
  password?: string;
}

export interface UserI extends UserMongoI {
  _id?: string;
  created?: string;
  updated?: string;
}
