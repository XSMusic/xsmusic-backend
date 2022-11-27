export class GithubUtilsService {
  private user = 'XSMusic';

  getUrl(type: string, repository: string, api = true) {
    const urls: any = {
      base: `https://${api ? 'api.github.com/repos' : 'github.com'}`,
      userRepo: `${this.user}/:repository`,
      issues: 'issues',
      actions: 'actions/workflows',
    };
    return `${urls.base}/${urls.userRepo.replace(':repository', repository)}/${
      urls[type]
    }`;
  }
}
