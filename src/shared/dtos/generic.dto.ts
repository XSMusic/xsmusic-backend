import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class IdDto {
  @IsString() id: string;
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
  @IsArray() order: string[];
  @IsOptional() @IsString() site: string;
  @IsOptional() @IsArray() filter: string[];
}

export class SiteDto {
  @IsString() site: string;
}

export class SearchDto {
  @IsString() value: string;
  @IsOptional() @IsNumber() limit: number;
}
