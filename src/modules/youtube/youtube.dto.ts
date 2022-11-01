import { IsString } from 'class-validator';

export class YoutubeSearchDto {
  @IsString() query: string;
}
