import { config } from '@config';
import {
  GithubIssueOriginalI,
  GithubIssueI,
  GithubIssueM,
  GithubIssueCreateDto,
  GithubUtilsService,
} from '@github';
import { Logger } from '@services';
import axios, { AxiosRequestHeaders } from 'axios';

export class GithubIssueService {
  private githubUtilsService = new GithubUtilsService();
  private respositories = ['xsmusic-backend', 'xsmusic-app'];
  private headers: AxiosRequestHeaders = {
    Authorization: `Bearer ${config.tokens.github}`,
  };

  getAll(): Promise<GithubIssueI[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const items: GithubIssueI[] = [];
        for (const repo of this.respositories) {
          const url = this.githubUtilsService.getUrl('issues', repo);
          const response = await axios.get(url, { headers: this.headers });
          const data: GithubIssueOriginalI[] = response.data;
          for (const oIssue of data) {
            const issue: GithubIssueI = new GithubIssueM(oIssue, repo);
            items.push(issue);
          }
        }
        resolve(items);
      } catch (error) {
        reject(error);
      }
    });
  }

  create(body: GithubIssueCreateDto) {
    return new Promise(async (resolve, reject) => {
      try {
        const url = this.githubUtilsService.getUrl('issues', body.repo);
        await axios.post(url, body, { headers: this.headers });
        resolve({ message: 'Issue creada correctamente' });
      } catch (error) {
        Logger.error(error);
        reject(error);
      }
    });
  }
}
