import { GetAllDto } from '@dtos';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class MediaGetAllDto extends GetAllDto {
  @IsString() type: string;
}

export class MediaCreateDto {
  @IsString() name: string;
  @IsString() type: string;
  @IsString() source: string;
  @IsArray() artists: string[];
  @IsArray() styles: string[];
  @IsOptional() @IsString() image: string;
  @IsOptional() @IsString() info: string;
}

export class MediaUpdateDto extends MediaCreateDto {
  @IsString() _id: string;
}
