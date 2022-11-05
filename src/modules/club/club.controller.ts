import { NextFunction, Request, Response, Router } from 'express';
import {
  ClubCreateDto,
  ClubGetAllDto,
  ClubI,
  ClubService,
  ClubUpdateDto,
} from '@club';
import { ControllerI } from '@interfaces';
import { HttpException } from 'src/shared/exceptions';
import { checkAdminToken, validationMiddleware } from '@middlewares';
import { IdSlugDto } from '@dtos';

export class ClubController implements ControllerI {
  path = '/clubs';
  router = Router();
  private clubService = new ClubService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/getAll`,
      validationMiddleware(ClubGetAllDto),
      this.getAll
    );
    this.router.post(
      `${this.path}/getOne`,
      validationMiddleware(IdSlugDto),
      this.getOne
    );
    this.router.post(
      `${this.path}/create`,
      validationMiddleware(ClubCreateDto),
      this.create
    );
    this.router.put(
      `${this.path}/update`,
      validationMiddleware(ClubUpdateDto),
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
      const body: ClubGetAllDto = request.body;
      const result = await this.clubService.getAll(body);
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
      const body: IdSlugDto = request.body;
      const result: ClubI = await this.clubService.getOne(body);
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
      const result = await this.clubService.create(body);
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
      const result = await this.clubService.update(body);
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
      const result = await this.clubService.deleteOne(id);
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
      const result = await this.clubService.deleteAll();
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
