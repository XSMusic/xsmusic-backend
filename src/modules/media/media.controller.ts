import { NextFunction, Request, Response, Router } from 'express';
import {
  MediaCreateDto,
  MediaGetAllDto,
  MediaI,
  MediaService,
  MediaUpdateDto,
} from '@media';
import { ControllerI } from '@interfaces';
import { HttpException } from '@exceptions';
import { checkAdminToken, validationMiddleware } from '@middlewares';

export class MediaController implements ControllerI {
  path = '/media';
  router = Router();
  private mediaService = new MediaService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/getAll/:type`,
      validationMiddleware(MediaGetAllDto),
      this.getAll
    );
    this.router.get(`${this.path}/getOne/:type/:value`, this.getOne);
    this.router.post(
      `${this.path}/create`,
      validationMiddleware(MediaCreateDto),
      this.create
    );
    this.router.put(
      `${this.path}/update`,
      validationMiddleware(MediaUpdateDto),
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
      const body: MediaGetAllDto = request.body;
      const result = await this.mediaService.getAll(body);
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
      const result: MediaI = await this.mediaService.getOne(type, value);
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
      const result = await this.mediaService.create(body);
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
      const result = await this.mediaService.update(body);
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
      const result = await this.mediaService.deleteOne(id);
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
      const result = await this.mediaService.deleteAll();
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
