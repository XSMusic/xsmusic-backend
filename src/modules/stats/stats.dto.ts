import { IsNumber, IsString } from 'class-validator';

export class StatsGetTopStatsDto {
  @IsNumber() limit?: number;
  @IsString() type: 'artist' | 'club' | 'festival';
}
