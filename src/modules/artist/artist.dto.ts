import { IsOptional, IsString } from 'class-validator';

export class ArtistCreateDto {
  @IsString() name: string;
  @IsOptional() @IsString() country: string;
  @IsOptional() @IsString() image: string;
  @IsOptional() @IsString() birthdate: string;
  @IsOptional() @IsString() info: string;
  @IsOptional() styles: string[];
}

export class ArtistUpdateDto extends ArtistCreateDto {
  @IsString() _id: string;
}
