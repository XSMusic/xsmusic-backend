import { ControllerI } from '@interfaces';
import { Router } from 'express';
import {
  GithubIssueController,
  GithubActionController,
  GithubIssueCreateDto,
} from '@github';
import { validationMiddleware } from '@middlewares';

export class GithubController implements ControllerI {
  path = '/github';
  router = Router();
  private githubActionController = new GithubActionController();
  private githubIssueController = new GithubIssueController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Actions

    this.router.get(
      `${this.path}/actions/all`,
      this.githubActionController.getAll
    );

    // Issues
    this.router.get(
      `${this.path}/issues/all/:tag?`,
      this.githubIssueController.getAll
    );

    this.router.post(
      `${this.path}/issues`,
      validationMiddleware(GithubIssueCreateDto),
      this.githubIssueController.create
    );
  }
}
