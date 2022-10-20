import * as mongoose from 'mongoose';

export interface UserI {
  email: string;
  name: string;
  role: string;
  country: string;
  password?: string;
  googleId?: string;
  appleId?: string;
  fcm?: string;
  _id?: string;
}

export interface UserMongoI extends mongoose.Document {
  email: string;
  name: string;
  role: string;
  country: string;
  googleId?: string;
  appleId?: string;
  fcm?: string;
  password?: string;
  passwordCompare?: any;
}
