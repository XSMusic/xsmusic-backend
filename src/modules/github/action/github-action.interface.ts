export interface GithubActionI {
  name: string;
  created: string;
  updated: string;
  url: string;
  badge: string;
  repo: string;
}

export interface GithubActionOriginalI {
  total_count: number;
  workflows: GithubActionOriginalWorkflowI[];
}

export interface GithubActionOriginalWorkflowI {
  id: number;
  node_id: string;
  name: string;
  path: string;
  state: string;
  created_at: string;
  updated_at: string;
  url: string;
  html_url: string;
  badge_url: string;
}
