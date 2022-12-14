import { GetAllDto } from '@dtos';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class ImageGetAllDto extends GetAllDto {
  @IsString() @IsOptional() type: string;
}

export class ImageUploadDto {
  @IsString() id: string;
  @IsString() type: 'artist' | 'event' | 'media' | 'site' | 'user';
  @IsOptional() @IsNumber() position?: number;
}

export class ImageUpdateDto {
  @IsString() _id: string;
  @IsBoolean() firstImage: boolean;
  @IsNumber() position: number;
}

export class ImageUploadByUrlDto {
  @IsString() id: string;
  @IsString() url: string;
  @IsString() type: 'artist' | 'media' | 'site' | 'user';
  @IsOptional() @IsNumber() position?: number;
}

export class ImageSetFirstImageDto {
  @IsString() type: string;
  @IsString() typeId: string;
  @IsString() imageId: string;
}

export class ImageResizeAllDto {
  @IsString() type: 'artist' | 'event' | 'media' | 'site' | 'user';
}
