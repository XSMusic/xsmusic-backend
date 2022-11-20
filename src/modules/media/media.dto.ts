import { GetAllDto } from '@dtos';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class MediaGetAllDto extends GetAllDto {
  @IsString() type: string;
}

export class MediaCreateDto {
  @IsString() name: string;
  @IsString() type: string;
  @IsString() source: string;
  @IsNumber() year: number;
  @IsArray() artists: string[];
  @IsArray() styles: string[];
  @IsOptional() site: string;
  @IsOptional() @IsString() image: string;
  @IsOptional() @IsString() info: string;
}

export class MediaUpdateDto extends MediaCreateDto {
  @IsString() _id: string;
}
