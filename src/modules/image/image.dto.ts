import { GetAllDto } from '@dtos';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class ImageGetAllDto extends GetAllDto {
  @IsString() @IsOptional() type: string;
}

export class ImageUploadDto {
  @IsString() type: string;
  @IsString() id: string;
}

export class ImageUpdateDto {
  @IsString() _id: string;
  @IsBoolean() firstImage: boolean;
  @IsNumber() position: number;
}

export class ImageSetFirstImageDto {
  @IsString() imageId: string;
  @IsString() carId: string;
}
