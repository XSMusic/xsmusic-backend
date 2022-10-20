import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class AuthLogInDto {
  @IsString() email: string;
  @IsString() password: string;
  @IsOptional() @IsString() site: string;
}

export class AuthRegisterDto {
  @IsString() email: string;
  @IsString() name: string;
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() password?: string;
}

export class GoogleUserDto {
  @IsOptional() @IsString() displayName?: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsBoolean() emailVerified?: boolean;
  @IsOptional() @IsBoolean() isAnonymous?: boolean;
  @IsOptional() @IsString() photoUrl: string;
  @IsOptional() @IsString() providerId: string;
  @IsOptional() @IsString() uid: string;
}
