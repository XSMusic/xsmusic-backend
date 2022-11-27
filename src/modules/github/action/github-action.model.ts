import { GithubActionI, GithubActionOriginalWorkflowI } from '@github';

export class GithubActionM implements GithubActionI {
  name: string;
  badge: string;
  url: string;
  repo: string;
  created: string;
  updated: string;

  constructor(data: GithubActionOriginalWorkflowI, repo: string, url: string) {
    this.name = data.name ?? '';
    this.badge = data.badge_url ?? '';
    this.repo = repo;
    this.created = data.created_at ?? '';
    this.updated = data.updated_at ?? '';
    const path = data.path;
    this.url = `${url}/${path.split('.github/workflows/')[1]}` ?? '';
  }
}
