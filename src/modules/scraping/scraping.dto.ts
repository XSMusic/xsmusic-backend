import { IsOptional, IsString } from 'class-validator';

export class ScrapingGetInfoArtistDto {
  @IsString() name: string;
  @IsOptional() @IsString() countryCode: string;
}
