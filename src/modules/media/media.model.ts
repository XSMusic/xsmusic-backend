import { MediaMongoI } from '@media';
import * as mongoose from 'mongoose';

const typeValid = {
  values: ['set', 'track'],
  message: '{VALUE} no es un tipo valido',
};

const sourceValid = {
  values: ['youtube'],
  message: '{VALUE} no es un source valido',
};

export const mediaSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    artists: [{ type: mongoose.Types.ObjectId, ref: 'Artist' }],
    site: { type: mongoose.Types.ObjectId, ref: 'Site' },
    type: { type: String, default: 'set', enum: typeValid },
    styles: [{ type: mongoose.Types.ObjectId, ref: 'Style' }],
    info: { type: String, default: '' },
    source: { type: String, default: 'youtube', enum: sourceValid },
    sourceId: { type: String, default: '' },
    year: { type: Number, default: 0 },
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

export const Media = mongoose.model<MediaMongoI>('Media', mediaSchema);
