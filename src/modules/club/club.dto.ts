import { GetAllDto } from '@dtos';
import { IsOptional, IsString } from 'class-validator';

export class ClubGetAllDto extends GetAllDto {}

export class ClubCreateDto {
  @IsString() name: string;
  @IsOptional() @IsString() country: string;
  @IsOptional() @IsString() image: string;
  @IsOptional() @IsString() birthdate: string;
  @IsOptional() @IsString() info: string;
  @IsOptional() styles: string[];
}

export class ClubUpdateDto extends ClubCreateDto {
  @IsString() _id: string;
}
