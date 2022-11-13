import { GetAllDto } from '@dtos';
import { IsOptional, IsString } from 'class-validator';

export class SiteGetAllDto extends GetAllDto {
  @IsString() type: string;
}

export class SiteCreateDto {
  @IsString() name: string;
  @IsOptional() @IsString() country: string;
  @IsOptional() @IsString() image: string;
  @IsOptional() @IsString() birthdate: string;
  @IsOptional() @IsString() info: string;
  @IsOptional() styles: string[];
}

export class SiteUpdateDto extends SiteCreateDto {
  @IsString() _id: string;
}