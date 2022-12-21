import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsOptional() @IsArray() order?: string[];
  @IsOptional() @IsArray() filter?: string[];
  @IsOptional() @IsString() type: string;
}

export class SiteDto {
  @IsString() site: string;
}
