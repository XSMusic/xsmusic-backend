import { NextFunction, Request, Response, Router } from 'express';
import { SystemService } from '@system';
import { ControllerI } from '@interfaces';
import { HttpException } from '@exceptions';
import { checkAdminToken } from '@middlewares';

export class SystemController implements ControllerI {
  path = '/system';
  router = Router();
  private systemService = new SystemService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/getResume`, checkAdminToken, this.getResume);
    this.router.get(
      `${this.path}/generateSitemaps`,
      checkAdminToken,
      this.generateSitemaps
    );
  }

  private getResume = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const items = await this.systemService.getResume();
      response.status(200).send(items);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private generateSitemaps = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const items = await this.systemService.generateSitemaps();
      response.status(200).send(items);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
