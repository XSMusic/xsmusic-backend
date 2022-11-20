import { IsArray, IsOptional, IsString } from 'class-validator';

export class EventCreateDto {
  @IsString() name: string;
  @IsString() date: string;
  @IsArray() styles: string[];
  @IsString() site: string;
  @IsArray() artists: string[];
  @IsString() info: string;
}

export class EventUpdateDto extends EventCreateDto {
  @IsOptional() @IsString() _id: string;
  @IsOptional() @IsString() name: string;
  @IsOptional() @IsString() date: string;
  @IsOptional() @IsArray() styles: string[];
  @IsOptional() @IsString() site: string;
  @IsOptional() @IsArray() artists: string[];
  @IsOptional() @IsString() info: string;
}
