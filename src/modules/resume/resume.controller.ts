import { NextFunction, Request, Response, Router } from 'express';
import { ResumeService } from '@resume';
import { ControllerI } from '@interfaces';
import { HttpException } from '@exceptions';

export class ResumeController implements ControllerI {
  path = '/resume';
  router = Router();
  private resumeService = new ResumeService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/getForAll`, this.getForAll);
  }

  private getForAll = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const items = await this.resumeService.getForAll();
      response.status(200).send(items);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
