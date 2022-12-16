export interface DynamicFormMongoI extends Document {
  name: string;
  info: string;
}

export interface DynamicFormI extends Document {
  _id?: string;
  name: string;
  info: string;
  created?: string;
  updated?: string;
}

export interface DynamicFormItemMongoI extends Document {
  name: string;
  label: string;
  value: string;
  type: string;
  form: any;
  required: boolean;
  options?: DynamicFormOptionsI;
  validators: DynamicFormValidators;
}

export interface DynamicFormItemI {
  _id?: string;
  name: string;
  label: string;
  value: string;
  type: string;
  placeholder: string;
  form: any;
  required: boolean;
  options?: DynamicFormOptionsI;
  validators?: DynamicFormValidators;
  created?: string;
  updated?: string;
}

export interface DynamicFormValidators {
  min?: number;
  max?: number;
  required?: boolean;
  requiredTrue?: boolean;
  email?: boolean;
  minLength?: boolean;
  maxLength?: boolean;
  pattern?: string;
  nullValidator?: boolean;
}
export interface DynamicFormOptionsI {
  min?: string;
  max?: string;
  step?: string;
  icon?: string;
}
