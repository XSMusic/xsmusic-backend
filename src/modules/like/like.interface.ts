import { Document } from 'mongoose';

export interface LikeMongoI extends Document {
  type: 'artist' | 'event' | 'media' | 'site' | 'user';
  artist?: any;
  event?: any;
  media?: any;
  site?: any;
  user: any;
}

export interface LikeI {
  _id?: string;
  type: 'artist' | 'event' | 'media' | 'site' | 'user';
  artist?: any;
  event?: any;
  media?: any;
  site?: any;
  user: any;
  created?: string;
  updated?: string;
}
