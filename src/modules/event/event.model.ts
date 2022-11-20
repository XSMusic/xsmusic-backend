import { EventMongoI } from '@event';
import * as mongoose from 'mongoose';

export const schema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    date: { type: String, default: '' },
    styles: [{ type: mongoose.Types.ObjectId, ref: 'Style' }],
    site: { type: mongoose.Types.ObjectId, ref: 'Style' },
    artists: [{ type: mongoose.Types.ObjectId, ref: 'Artist' }],
    info: { type: String, default: '' },
    slug: { type: String, default: '' },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: 'created', updatedAt: 'updated' },
    id: false,
    versionKey: false,
  }
);

export const Event = mongoose.model<EventMongoI>('Event', schema);
