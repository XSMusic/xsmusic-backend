import { Document } from 'mongoose';

export interface ScrapingDiscartsMongoI extends Document {
  value: string;
  source: string;
}

export interface ScrapingDiscartsI extends ScrapingDiscartsMongoI {
  _id?: string;
}
