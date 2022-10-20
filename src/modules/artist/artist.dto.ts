import { GetAllDto } from "@dtos";
import { IsArray, IsOptional, IsString } from "class-validator";
// import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class ArtistGetAllDto extends GetAllDto {}

export class ArtistCreateDto {
  @IsString() name: string;
  @IsOptional() @IsString() country: string;
  @IsOptional() @IsString() image: string;
  @IsOptional() @IsString() birthdate: string;
  @IsOptional()  styles: string[];
}

export class ArtistUpdateDto extends ArtistCreateDto {
  @IsString() _id: string;
}

// export class UserCreateFakeDto {
//   @IsNumber() total: number;
// }

// export class UserUpdateDto {
//   @IsOptional() @IsString() _id: string;
//   @IsOptional() @IsString() name: string;
//   @IsOptional() @IsString() email: string;
//   @IsOptional() @IsString() role: string;
//   @IsOptional() @IsString() country: string;
//   @IsOptional() @IsString() googleId?: string;
//   @IsOptional() @IsString() appleId?: string;
// }
