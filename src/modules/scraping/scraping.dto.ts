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

export class ScrapingGetListEventsDto {
  @IsString() source: 'ra';
  @IsString() maxResults: string;
  @IsString() dateFrom: string;
  @IsString() dateTo: string;
  @IsString() @IsOptional() area: string;
}
