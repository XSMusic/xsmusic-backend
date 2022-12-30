import { IsOptional, IsString } from 'class-validator';

export class LikeCreateDto {
  @IsString() type: string;
  @IsOptional() @IsString() subType?: string;
  @IsOptional() @IsString() artist?: string;
  @IsOptional() @IsString() event?: string;
  @IsOptional() @IsString() media?: string;
  @IsOptional() @IsString() site?: string;
}
