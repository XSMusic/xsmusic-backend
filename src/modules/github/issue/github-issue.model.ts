import { GithubIssueI } from '@github';
import { GithubIssueOriginalI } from './github-issue.interface';

export class GithubIssueM implements GithubIssueI {
  title: string;
  user: string;
  labels: string[] = [];
  state: string;
  assignee: string;
  comments: number;
  url: string;
  repo: string;
  created: string;
  updated: string;

  constructor(data: GithubIssueOriginalI, repo: string) {
    this.title = data.title ?? '';
    this.user = data.user?.login ?? '';
    data.labels.forEach((item) => this.labels.push(item.name));
    this.state = data.state ?? '';
    this.assignee = data.assignee?.login ?? '';
    this.comments = data.comments ?? 0;
    this.url = data.html_url ?? '';
    this.repo = repo;
    this.created = data.created_at ?? '';
    this.updated = data.updated_at ?? '';
  }
}
