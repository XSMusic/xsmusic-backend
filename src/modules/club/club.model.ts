import { ClubMongoI } from '@club';
import { styleSchema } from '@style';
import * as mongoose from 'mongoose';

export const clubSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    address: {
      city: { type: String, default: '' },
      country: { type: String, default: '' },
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    styles: [{ type: mongoose.Types.ObjectId, ref: styleSchema }],
    image: { type: String, default: '' },
    info: { type: String, default: '' },
    social: {
      web: { type: String, default: '' },
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      spotify: { type: String, default: '' },
      soundcloud: { type: String, default: '' },
      tiktok: { type: String, default: '' },
      instagram: { type: String, default: '' },
      email: { type: String, default: '' },
    },
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

export const Club = mongoose.model<ClubMongoI>('Club', clubSchema);
