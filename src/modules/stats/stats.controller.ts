import { NextFunction, Request, Response, Router } from 'express';
import { StatsService, StatsTotalsAdminI } from '@stats';
import { ControllerI } from '@interfaces';
import { HttpException } from '@exceptions';
import { checkAdminToken } from '@middlewares';

export class StatsController implements ControllerI {
  path = '/stats';
  router = Router();
  private statsService = new StatsService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/getForAdmin`, [checkAdminToken], this.getAll);
  }

  private getAll = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const items: StatsTotalsAdminI = await this.statsService.getForAdmin();
      response.status(200).send(items);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
