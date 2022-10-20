import * as mongoose from 'mongoose';
import { MenuI } from '@menu';

const typesValid = {
  values: ['link', 'sub', 'extLink', 'extTabLink'],
  message: '{VALUE} no es un tipo permitido',
};

const schema = new mongoose.Schema(
  {
    route: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true, enum: typesValid },
    icon: { type: String, required: true },
    children: { type: Array, required: false },
    position: { type: Number, required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: 'created', updatedAt: 'updated' },
    id: false,
    versionKey: false,
  }
);

export const Menu = mongoose.model<MenuI>('Menu', schema);
