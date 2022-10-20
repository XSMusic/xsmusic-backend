import * as mongoose from 'mongoose';
import { UserMongoI } from './user.interface';

const rolsValid = {
  values: ['ADMIN', 'USER', 'FAKE'],
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: 'created', updatedAt: 'updated' },
    id: false,
  }
);

const data: mongoose.VirtualTypeOptions[] = [
  {
    ref: 'Car',
    localField: '_id',
    foreignField: 'driver',
    justOne: false,
  },
  {
    ref: 'Image',
    localField: '_id',
    foreignField: 'tournament',
    justOne: true,
  },
];

schema.virtual('cars', data[0]);
schema.virtual('image', data[1]);

schema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.__v;
  },
});

export const User = mongoose.model<UserMongoI>('User', schema);
