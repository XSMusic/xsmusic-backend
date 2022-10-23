import { GetAllDto } from '@dtos';
import { IsBoolean, IsString } from 'class-validator';

export class StyleGetAllDto extends GetAllDto {
  @IsBoolean() complete: boolean;
}

export class StyleCreateDto {
  @IsString() name: string;
}

export class StyleUpdateDto extends StyleCreateDto {
  @IsString() _id: string;
}
