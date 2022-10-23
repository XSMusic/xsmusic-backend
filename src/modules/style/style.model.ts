import { StyleMongoI } from '@style';
import * as mongoose from 'mongoose';

export const styleSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: 'created', updatedAt: 'updated' },
    id: false,
  }
);

export const Style = mongoose.model<StyleMongoI>('Style', styleSchema);
