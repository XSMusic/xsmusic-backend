import { GetAllDto } from '@dtos';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SiteGetAllDto extends GetAllDto {
  @IsString() type: string;
  @IsOptional() @IsBoolean() map: boolean;
  @IsOptional() @IsNumber() maxDistance?: number;
  @IsOptional() @IsArray() coordinates?: number[];
}

export class SiteCreateDto {
  @IsString() name: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() images?: any;
  @IsOptional() @IsString() info?: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() address?: any;
  @IsOptional() styles?: string[];
}

export class SiteUpdateDto extends SiteCreateDto {
  @IsString() _id: string;
}
