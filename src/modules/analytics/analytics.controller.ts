import { NextFunction, Request, Response, Router } from 'express';
import { AnalyticsGetGenericDto, AnalyticsService } from '@analytics';
import { ControllerI } from '@interfaces';
import { HttpException } from '@exceptions';
import { validationMiddleware, checkAdminToken } from '@middlewares';

export class AnalyticsController implements ControllerI {
  path = '/analytics';
  router = Router();
  private analyticsService = new AnalyticsService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/getVisits`,
      [validationMiddleware(AnalyticsGetGenericDto), checkAdminToken],
      this.getVisits
    );
    this.router.post(
      `${this.path}/getDataForVMap`,
      [validationMiddleware(AnalyticsGetGenericDto), checkAdminToken],
      this.getDataForVMap
    );
    this.router.post(
      `${this.path}/getVisitsRealTime`,
      checkAdminToken,
      this.getVisitsRealTime
    );
    this.router.post(
      `${this.path}/getEventsWithCategories`,
      [validationMiddleware(AnalyticsGetGenericDto), checkAdminToken],
      this.getEventsWithCategories
    );
  }

  private getVisits = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: AnalyticsGetGenericDto = request.body;
      const result = await this.analyticsService.getVisits(body);
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private getDataForVMap = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: AnalyticsGetGenericDto = request.body;
      const result = await this.analyticsService.getDataForVMap(body);
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private getVisitsRealTime = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.analyticsService.getVisitsRealTime();
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private getEventsWithCategories = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: AnalyticsGetGenericDto = request.body;
      const result = await this.analyticsService.getEventsWithCategories(body);
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
