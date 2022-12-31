import { LikeMongoI } from '@like';
import * as mongoose from 'mongoose';

const typesValid = {
  values: ['artist', 'event', 'media', 'site'],
  message: '{VALUE} no es un tipo permitido',
};

export const likeSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, enum: typesValid },
    artist: { type: mongoose.Types.ObjectId, required: false, ref: 'Artist' },
    event: { type: mongoose.Types.ObjectId, required: false, ref: 'Event' },
    media: { type: mongoose.Types.ObjectId, required: false, ref: 'Media' },
    site: { type: mongoose.Types.ObjectId, required: false, ref: 'Site' },
    user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: 'created', updatedAt: 'updated' },
    id: false,
    versionKey: false,
  }
);
export const Like = mongoose.model<LikeMongoI>('Like', likeSchema);
