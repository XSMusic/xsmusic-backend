import * as mongoose from 'mongoose';
import { UserMongoI } from './user.interface';

const rolsValid = {
  values: ['ADMIN', 'USER'],
  message: '{VALUE} no es un rol permitido',
};

const darkModeValid = {
  values: ['active', 'desactive', 'system'],
  message: '{VALUE} no es un rol permitido',
};

const schema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, default: 'USER', enum: rolsValid },
    country: { type: String, default: 'es' },
    googleId: { type: String, required: false },
    appleId: { type: String, required: false },
    fcm: { type: String, required: false },
    darkMode: { type: String, default: 'system', enum: darkModeValid },
    slug: { type: String, default: '' },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: 'created', updatedAt: 'updated' },
    id: false,
  }
);

schema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.__v;
  },
});

export const User = mongoose.model<UserMongoI>('User', schema);
