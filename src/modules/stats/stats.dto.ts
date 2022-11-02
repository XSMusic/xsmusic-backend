import { IsNumber, IsString } from "class-validator";

export class StatsGetTopArtistsDto  {
  @IsString() type?: string;
  @IsNumber() limit?: number;
}
