import { SiteMongoI } from 'src/modules/site';
import { styleSchema } from '@style';
import * as mongoose from 'mongoose';

const typesValid = {
  values: ['club', 'festival'],
  message: '{VALUE} no es un tipo permitido',
};

const schema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    address: {
      street: { type: String, default: '' },
      town: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    type: { type: String, default: 'club', enum: typesValid },
    styles: [{ type: mongoose.Types.ObjectId, ref: styleSchema }],
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

export const Site = mongoose.model<SiteMongoI>('Site', schema);
