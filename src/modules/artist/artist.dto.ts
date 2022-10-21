import { GetAllDto } from "@dtos";
import { IsArray, IsOptional, IsString } from "class-validator";

export class ArtistGetAllDto extends GetAllDto {
  @IsOptional() @IsArray() filter: string[];
}

export class ArtistCreateDto {
  @IsString() name: string;
  @IsOptional() @IsString() country: string;
  @IsOptional() @IsString() image: string;
  @IsOptional() @IsString() birthdate: string;
  @IsOptional() styles: string[];
}

export class ArtistUpdateDto extends ArtistCreateDto {
  @IsString() _id: string;
}
