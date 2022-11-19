import { IsOptional, IsString } from 'class-validator';

export class YoutubeSearchDto {
  @IsString() query: string;
  @IsOptional() @IsString() maxResults = '20';
}
