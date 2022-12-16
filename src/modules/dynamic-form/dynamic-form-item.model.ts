import { DynamicFormItemMongoI } from '@dynamicForm';
import * as mongoose from 'mongoose';

export const dynamicFormItemSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    label: { type: String, default: '' },
    value: { type: String, default: '' },
    type: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    form: { type: mongoose.Types.ObjectId, ref: 'DynamicForm', default: '' },
    position: { type: Number, required: true },
    required: { type: Boolean, default: false },
    validators: {
      min: { type: Number, required: false },
      max: { type: Number, required: false },
      required: { type: Boolean, required: false },
      requiredTrue: { type: Boolean, required: false },
      email: { type: Boolean, required: false },
      minLength: { type: Boolean, required: false },
      maxLength: { type: Boolean, required: false },
      pattern: { type: Boolean, required: false },
      nullValidator: { type: Boolean, required: false },
    },
    options: {
      min: { type: String, required: false },
      max: { type: String, required: false },
      step: { type: String, required: false },
      icon: { type: String, required: false },
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

export const DynamicFormItem = mongoose.model<DynamicFormItemMongoI>(
  'DynamicFormItem',
  dynamicFormItemSchema
);
