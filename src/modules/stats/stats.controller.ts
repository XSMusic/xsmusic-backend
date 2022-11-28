import { NextFunction, Request, Response, Router } from 'express';
import { StatsService, StatsTotalsAdminI, StatsGetTopArtistsDto } from '@stats';
import { ControllerI } from '@interfaces';
import { HttpException } from '@exceptions';
import { checkAdminToken, validationMiddleware } from '@middlewares';

export class StatsController implements ControllerI {
  path = '/stats';
  router = Router();
  private statsService = new StatsService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/getForAdmin`, [checkAdminToken], this.getAll);
    this.router.post(
      `${this.path}/getTopArtists`,
      validationMiddleware(StatsGetTopArtistsDto),
      this.getTopArtist
    );
    this.router.get(`${this.path}/getStatsArtists`, this.getStatsArtists);
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

  private getTopArtist = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: StatsGetTopArtistsDto = request.body;
      const items = await this.statsService.getTopArtists(body);
      response.status(200).send(items);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private getStatsArtists = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const items = await this.statsService.getStatsArtists();
      response.status(200).send(items);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
