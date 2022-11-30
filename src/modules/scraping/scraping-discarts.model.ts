import * as mongoose from 'mongoose';
import { ScrapingDiscartsMongoI } from '@scraping';

const typesValid = {
  values: ['youtube', 'event'],
  message: '{VALUE} no es un tipo permitido',
};

const schema = new mongoose.Schema(
  {
    value: { type: String, default: '' },
    source: { type: String, enum: typesValid },
  },
  {
    id: false,
    versionKey: false,
  }
);

export const ScrapingDiscarts = mongoose.model<ScrapingDiscartsMongoI>(
  'ScrapingDiscarts',
  schema
);
