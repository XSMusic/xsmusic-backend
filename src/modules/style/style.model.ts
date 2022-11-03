import { StyleMongoI } from '@style';
import * as mongoose from 'mongoose';

export const styleSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    colors: {
      bg: { type: String, default: '' },
      text: { type: String, default: '' },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: 'created', updatedAt: 'updated' },
    id: false,
    versionKey: false,
  }
);

export const Style = mongoose.model<StyleMongoI>('Style', styleSchema);
