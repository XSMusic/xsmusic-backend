import { NextFunction, Request, Response, Router } from 'express';
import {
  SiteCreateDto,
  SiteGetAllDto,
  SiteI,
  SiteService,
  SiteUpdateDto,
} from 'src/modules/site';
import { ControllerI } from '@interfaces';
import { HttpException } from 'src/shared/exceptions';
import { checkAdminToken, validationMiddleware } from '@middlewares';

export class SiteController implements ControllerI {
  path = '/sites';
  router = Router();
  private siteService = new SiteService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/getAll`,
      validationMiddleware(SiteGetAllDto),
      this.getAll
    );
    this.router.get(`${this.path}/getOne/:type/:value`, this.getOne);
    this.router.post(
      `${this.path}/create`,
      validationMiddleware(SiteCreateDto),
      this.create
    );
    this.router.put(
      `${this.path}/update`,
      validationMiddleware(SiteUpdateDto),
      checkAdminToken,
      this.update
    );
    this.router.delete(`${this.path}/one/:id`, checkAdminToken, this.deleteOne);
    this.router.delete(`${this.path}/all`, checkAdminToken, this.deleteAll);
  }

  private getAll = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: SiteGetAllDto = request.body;
      const result = await this.siteService.getAll(body);
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private getOne = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const type = request.params.type as 'id' | 'slug';
      const value = request.params.value;
      const result: SiteI = await this.siteService.getOne(type, value);
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private create = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: any = request.body;
      const result = await this.siteService.create(body);
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private update = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body = request.body;
      const result = await this.siteService.update(body);
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private deleteOne = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const id = request.params.id;
      const result = await this.siteService.deleteOne(id);
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private deleteAll = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.siteService.deleteAll();
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
