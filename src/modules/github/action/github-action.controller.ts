import { Request, Response, NextFunction } from 'express';
import { GithubActionService } from '@github';
import { HttpException } from '@exceptions';

export class GithubActionController {
  private githubActionService = new GithubActionService();

  getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const items = await this.githubActionService.getAll();
      response.status(200).send(items);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
