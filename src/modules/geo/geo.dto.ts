import { IsArray, IsString } from 'class-validator';

export class GeoAddressToCoordinatesDto {
  @IsString() address: string;
}

export class GeoCoordinatesToAddressDto {
  @IsArray() coordinates: number[];
}
