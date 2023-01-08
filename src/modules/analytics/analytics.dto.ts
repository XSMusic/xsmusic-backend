import { IsOptional, IsString } from 'class-validator';

export class AnalyticsGetGenericDto {
  @IsString() startDate: string;
  @IsString() endDate: string;
  @IsOptional() @IsString() order?: string;
}
