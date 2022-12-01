import { config } from '@config';
import {
  GithubActionI,
  GithubActionM,
  GithubActionOriginalI,
  GithubUtilsService,
} from '@github';
import { Logger } from '@services';
import axios, { AxiosRequestHeaders } from 'axios';

export class GithubActionService {
  private githubUtilsService = new GithubUtilsService();
  private respositories = ['xsmusic-backend', 'xsmusic-app'];
  private headers: AxiosRequestHeaders = {
    Authorization: `Bearer ${config.tokens.github}`,
  };

  getAll(): Promise<GithubActionI[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const items: GithubActionI[] = [];
        for (const repo of this.respositories) {
          const urlApi = this.githubUtilsService.getUrl('actions', repo);
          const url = this.githubUtilsService.getUrl('actions', repo, false);
          const response = await axios.get(urlApi, { headers: this.headers });
          //   console.log({ urlApi, headers: this.headers });
          const data: GithubActionOriginalI = response.data;
          const workflows = data.workflows;
          for (const action of workflows) {
            const issue: GithubActionI = new GithubActionM(action, repo, url);
            items.push(issue);
          }
        }
        resolve(items);
      } catch (error) {
        Logger.error(error);
        reject(error);
      }
    });
  }
}
