import { artistSchema } from '@artist';
import { MediaMongoI } from '@media';
import { styleSchema } from '@style';
import * as mongoose from 'mongoose';

const typeValid = {
  values: ['set', 'track'],
  message: '{VALUE} no es un tipo valido',
};

const sourceValid = {
  values: ['youtube'],
  message: '{VALUE} no es un source valido',
};

const schema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    artists: [{ type: mongoose.Types.ObjectId, ref: artistSchema }],
    type: { type: String, default: 'set', enum: typeValid },
    image: { type: String, default: '' },
    styles: [{ type: mongoose.Types.ObjectId, ref: styleSchema }],
    info: { type: String, default: '' },
    source: { type: String, default: 'youtube', enum: sourceValid },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: 'created', updatedAt: 'updated' },
    id: false,
    versionKey: false,
  }
);

export const Media = mongoose.model<MediaMongoI>('Media', schema);
