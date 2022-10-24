import { ArtistMongoI } from '@artist';
import { styleSchema } from '@style';
import * as mongoose from 'mongoose';

const gendersValid = {
  values: ['male', 'female', 'various'],
  message: '{VALUE} no es un genero permitido',
};


const schema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    birthdate: { type: String, default: '' },
    styles: [{ type: mongoose.Types.ObjectId, ref: styleSchema }],
    country: { type: String, default: 'es' },
    image: { type: String, default: '' },
    gender: { type: String, default: 'male', enum: gendersValid },
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

export const Artist = mongoose.model<ArtistMongoI>('Artist', schema);
