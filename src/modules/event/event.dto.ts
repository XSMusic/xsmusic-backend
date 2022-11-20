import { IsString } from 'class-validator';

export class EventCreateDto {
  @IsString() name: string;
  @IsString() date: string;
  @IsString() styles: any[];
  @IsString() site: string;
  @IsString() artists: any[];
  @IsString() info: string;
}

export class EventUpdateDto extends ArtistCreateDto {
  @IsString() _id: string;
}
