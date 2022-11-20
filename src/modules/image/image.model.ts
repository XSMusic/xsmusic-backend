import { ImageMongoI } from '@image';
import * as mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['artist', 'event', 'media', 'site', 'user'],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    media: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media',
    },
    site: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Site',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    firstImage: {
      type: Boolean,
    },
    position: {
      type: Number,
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

export const Image = mongoose.model<ImageMongoI>('Image', schema);
