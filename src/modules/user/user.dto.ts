import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { GetAllDto } from '@dtos';

export class UserGetAllDto extends GetAllDto {
  @IsOptional() @IsBoolean() onlyFCM: boolean;
}
export class UserCreateDto {
  @IsString() name: string;
  @IsString() email: string;
  @IsString() password?: string;
  @IsString() country: string;
  @IsString() @IsOptional() role: string;
  @IsOptional() @IsString() googleId?: string;
  @IsOptional() @IsString() appleId?: string;
}

export class UserCreateFakeDto {
  @IsNumber() total: number;
}

export class UserUpdateDto {
  @IsOptional() @IsString() _id: string;
  @IsOptional() @IsString() name: string;
  @IsOptional() @IsString() email: string;
  @IsOptional() @IsString() role: string;
  @IsOptional() @IsString() country: string;
  @IsOptional() @IsString() googleId?: string;
  @IsOptional() @IsString() appleId?: string;
}
