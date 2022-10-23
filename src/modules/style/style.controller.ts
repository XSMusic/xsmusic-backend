import { NextFunction, Request, Response, Router } from 'express';
import {
  StyleCreateDto,
  StyleGetAllDto,
  StyleI,
  StyleService,
  StyleUpdateDto,
} from '@style';
import { ControllerI } from '@interfaces';
import { HttpException } from '@exceptions';
import { validationMiddleware } from '../../shared/middlewares/validation.middleware';
import { IdDto, SearchDto } from '@dtos';
import { checkAdminToken } from '@middlewares';

export class StyleController implements ControllerI {
  path = '/styles';
  router = Router();
  private styleService = new StyleService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/getAll`,
      validationMiddleware(StyleGetAllDto),
      this.getAll
    );
    this.router.post(
      `${this.path}/getOneById`,
      validationMiddleware(IdDto),
      this.getOneById
    );
    this.router.post(
      `${this.path}/search`,
      [validationMiddleware(SearchDto)],
      this.search
    );
    this.router.post(
      `${this.path}/create`,
      validationMiddleware(StyleCreateDto),
      this.create
    );
    this.router.put(
      `${this.path}/update`,
      validationMiddleware(StyleUpdateDto),
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
      const body: StyleGetAllDto = request.body;
      const items = await this.styleService.getAll(body);
      response.status(200).send(items);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private getOneById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: IdDto = request.body;
      const result: StyleI = await this.styleService.getOneById(body);
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private search = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: SearchDto = request.body;
      const items = await this.styleService.search(body);
      response.status(200).send(items);
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
      const result = await this.styleService.create(body);
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
      const result = await this.styleService.update(body);
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
      const result = await this.styleService.deleteOne(id);
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
      const result = await this.styleService.deleteAll();
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
