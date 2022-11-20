import { IsOptional, IsString } from 'class-validator';

export class ScrapingGetInfoArtistDto {
  @IsString() name: string;
  @IsOptional() @IsString() countryCode: string;
}

export class ScrapingGetInfoClubDto {
  @IsString() name: string;
  @IsOptional() @IsString() poblation: string;
}

export class ScrapingGetListMediaDto {
  @IsString() query: string;
  @IsString() maxResults: string;
  @IsString() source: 'youtube';
}
