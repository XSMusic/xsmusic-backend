import { DynamicFormMongoI } from '@dynamicForm';
import * as mongoose from 'mongoose';

export const dynamicFormSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    info: { type: String, required: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { createdAt: 'created', updatedAt: 'updated' },
    id: false,
    versionKey: false,
  }
);

export const DynamicForm = mongoose.model<DynamicFormMongoI>(
  'DynamicForm',
  dynamicFormSchema
);
