import { NextFunction, Request, Response, Router } from 'express';
import { ArtistCreateDto, ArtistService, ArtistUpdateDto } from '@artist';
import { ControllerI, RequestExtendedI } from '@interfaces';
import { HttpException } from 'src/shared/exceptions';
import {
  checkAdminToken,
  checkUserNotObligatory,
  validationMiddleware,
} from '@middlewares';
import { GetAllDto, GetOneDto } from '@dtos';

export class ArtistController implements ControllerI {
  path = '/artists';
  router = Router();
  private artistService = new ArtistService();
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
      [checkAdminToken, validationMiddleware(ArtistCreateDto)],
      this.create
    );
    this.router.put(
      `${this.path}/update`,
      [checkAdminToken, validationMiddleware(ArtistUpdateDto)],
      this.update
    );
    this.router.delete(`${this.path}/one/:id`, checkAdminToken, this.deleteOne);
  }

  private getAll = async (
    request: RequestExtendedI,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: GetAllDto = request.body;
      const result = await this.artistService.getAll(body, request.user);
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
      const result = await this.artistService.getOne(body, request.user);
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
      const result = await this.artistService.create(body);
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
      const result = await this.artistService.update(body);
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
      const result = await this.artistService.deleteOne(id);
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
      const result = await this.artistService.deleteAll();
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
