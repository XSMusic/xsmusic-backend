import { DynamicFormOptionsI, DynamicFormValidators } from '@dynamicForm';
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class DynamicFormCreateFormDto {
  @IsString() name: string;
  @IsOptional() @IsString() info: string;
}

export class DynamicFormGetOneDto {
  @IsString() type: string;
  @IsString() subType: string;
  @IsString() id: string;
}

export class DynamicFormCreateItemDto {
  @IsString() name: string;
  @IsString() label: string;
  @IsString() value: string;
  @IsString() type: string;
  @IsString() placeholder: string;
  @IsString() form: string;
  @IsBoolean() required: boolean;
  @IsNumber() position: number;
  @IsOptional() options?: DynamicFormValidators;
  @IsOptional() validators?: DynamicFormOptionsI;
}

export class DynamicFormUpdateDto {}
