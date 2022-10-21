import { IsString } from "class-validator";

export class StyleCreateDto {
  @IsString() name: string;
  
}

export class StyleUpdateDto extends StyleCreateDto {
  @IsString() _id: string;
}
