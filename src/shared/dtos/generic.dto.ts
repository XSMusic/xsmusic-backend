import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class IdDto {
  @IsString() id: string;
}

export class IdSlugDto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsString() slug?: string;
}

export class IdSiteDto {
  @IsString() id: string;
  @IsOptional() @IsString() site: string;
}

export class SlugDto {
  @IsString() slug: string;
}

export class GetAllDto {
  @IsNumber() page: number;
  @IsNumber() pageSize: number;
  @IsOptional() @IsBoolean() admin?: boolean;
  @IsOptional() @IsArray() order?: string[];
  @IsOptional() @IsArray() filter?: string[];
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsString() typeMedia?: string;
  @IsOptional() @IsBoolean() map?: boolean;
  @IsOptional() @IsBoolean() old?: boolean;
  @IsOptional() @IsBoolean() complete?: boolean;
  @IsOptional() @IsNumber() maxDistance?: number;
  @IsOptional() @IsArray() coordinates?: any;
  @IsOptional() @IsBoolean() hiddenSocial?: boolean;
}

export class GetOneDto {
  @IsString() type: 'id' | 'slug';
  @IsString() value: string;
  @IsOptional() @IsBoolean() admin?: boolean;
}

export class SiteDto {
  @IsString() site: string;
}
