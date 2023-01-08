import { NextFunction, Request, Response, Router } from 'express';
import {
  SiteCreateDto,
  SiteI,
  SiteService,
  SiteUpdateDto,
} from 'src/modules/site';
import { ControllerI, RequestExtendedI } from '@interfaces';
import { HttpException } from 'src/shared/exceptions';
import {
  checkAdminToken,
  checkUserNotObligatory,
  validationMiddleware,
} from '@middlewares';
import { GetAllDto, GetOneDto } from '@dtos';

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
      [validationMiddleware(GetAllDto), checkUserNotObligatory],
      this.getAll
    );
    this.router.post(
      `${this.path}/getOne`,
      [validationMiddleware(GetOneDto), checkUserNotObligatory],
      this.getOne
    );
    this.router.post(
      `${this.path}/create`,
      [checkAdminToken, validationMiddleware(SiteCreateDto)],
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
    request: RequestExtendedI,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: GetAllDto = request.body;
      const result = await this.siteService.getAll(body, request.user);
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private getOne = async (
    request: RequestExtendedI,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: GetOneDto = request.body;
      const result: SiteI = await this.siteService.getOne(body, request.user);
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
