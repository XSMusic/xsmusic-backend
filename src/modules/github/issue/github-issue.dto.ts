import { IsArray, IsOptional, IsString } from 'class-validator';

export class GithubIssueCreateDto {
  @IsString() owner: string;
  @IsString() repo: string;
  @IsString() title: string;
  @IsString() body: string;
  @IsOptional() @IsArray() assignees: string[];
  @IsArray() labels: string[];
}
