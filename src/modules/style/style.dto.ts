import { GetAllDto } from '@dtos';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class StyleGetAllDto extends GetAllDto {
  @IsOptional() @IsBoolean() complete?: boolean;
}

export class StyleCreateDto {
  @IsString() name: string;
}

export class StyleUpdateDto extends StyleCreateDto {
  @IsString() _id: string;
}
