import { GetAllDto } from '@dtos';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EventGetAllDto extends GetAllDto {
  @IsOptional() @IsBoolean() old = false;
  @IsOptional() @IsBoolean() map: boolean;
  @IsOptional() @IsNumber() maxDistance?: number;
  @IsOptional() @IsArray() coordinates?: number[];
}

export class EventGetAllForTypeDto extends EventGetAllDto {
  @IsString() id: string;
  @IsString() type: string;
}

export class EventCreateDto {
  @IsString() name: string;
  @IsString() date: string;
  @IsArray() styles: string[];
  @IsOptional() site: string;
  @IsArray() artists: string[];
  @IsString() info: string;
}

export class EventUpdateDto extends EventCreateDto {
  @IsOptional() @IsString() _id: string;
  @IsOptional() @IsString() name: string;
  @IsOptional() @IsString() date: string;
  @IsOptional() @IsArray() styles: string[];
  @IsOptional() site: string;
  @IsOptional() @IsArray() artists: string[];
  @IsOptional() @IsString() info: string;
}
