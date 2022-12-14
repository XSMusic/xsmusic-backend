import { NextFunction, Request, Response, Router } from 'express';
import { LikeCreateDto, LikeService } from '@like';
import { ControllerI } from '@interfaces';
import { HttpException } from '@exceptions';
import {
  checkAdminToken,
  checkUserToken,
  validationMiddleware,
} from '@middlewares';
import { GetAllDto, GetOneDto } from '@dtos';

export class LikeController implements ControllerI {
  path = '/likes';
  router = Router();
  private likeService = new LikeService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/getAll`,
      validationMiddleware(GetAllDto),
      this.getAll
    );
    this.router.post(
      `${this.path}/getOne`,
      validationMiddleware(GetOneDto),
      this.getOne
    );
    this.router.post(
      `${this.path}/create`,
      [checkUserToken, validationMiddleware(LikeCreateDto)],
      this.create
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
      const body: GetAllDto = request.body;
      const result = await this.likeService.getAll(body);
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
      const body: GetOneDto = request.body;
      const result = await this.likeService.getOne(body);
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
      const result = await this.likeService.create(body);
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
      const result = await this.likeService.deleteOne(id);
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
      const result = await this.likeService.deleteAll();
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
