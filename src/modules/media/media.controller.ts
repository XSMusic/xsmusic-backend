import { NextFunction, Request, Response, Router } from 'express';
import {
  MediaCreateDto,
  MediaGetAllDto,
  MediaGetAllForTypeDto,
  MediaI,
  MediaService,
  MediaUpdateDto,
} from '@media';
import { ControllerI, RequestExtendedI } from '@interfaces';
import { HttpException } from '@exceptions';
import {
  checkAdminToken,
  checkUserNotObligatory,
  validationMiddleware,
} from '@middlewares';
import { GetOneDto } from '@dtos';

export class MediaController implements ControllerI {
  path = '/media';
  router = Router();
  private mediaService = new MediaService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/getAll`,
      [validationMiddleware(MediaGetAllDto), checkUserNotObligatory],
      this.getAll
    );
    this.router.post(
      `${this.path}/getAllForType`,
      validationMiddleware(MediaGetAllForTypeDto),
      this.getAllForType
    );
    this.router.post(
      `${this.path}/getOne`,
      [validationMiddleware(GetOneDto), checkUserNotObligatory],
      this.getOne
    );
    this.router.post(
      `${this.path}/create`,
      [checkAdminToken, validationMiddleware(MediaCreateDto)],
      this.create
    );
    this.router.put(
      `${this.path}/update`,
      [checkAdminToken, validationMiddleware(MediaUpdateDto)],
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
      const body: MediaGetAllDto = request.body;
      const result = await this.mediaService.getAll(body, request.user);
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private getAllForType = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: MediaGetAllForTypeDto = request.body;
      const result = await this.mediaService.getAllForType(body);
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
      const result: MediaI = await this.mediaService.getOne(body, request.user);
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
