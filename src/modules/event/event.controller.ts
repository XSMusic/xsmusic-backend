import { NextFunction, Request, Response, Router } from 'express';
import {
  EventI,
  EventService,
  EventCreateDto,
  EventGetAllDto,
  EventUpdateDto,
} from '@event';
import { ControllerI } from '@interfaces';
import { HttpException } from '@exceptions';
import { checkAdminToken, validationMiddleware } from '@middlewares';

export class EventController implements ControllerI {
  path = '/events';
  router = Router();
  private eventService = new EventService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/getAll`,
      validationMiddleware(EventGetAllDto),
      this.getAll
    );
    this.router.get(`${this.path}/getOne/:type/:value`, this.getOne);
    this.router.post(
      `${this.path}/create`,
      validationMiddleware(EventCreateDto),
      this.create
    );
    this.router.put(
      `${this.path}/update`,
      validationMiddleware(EventUpdateDto),
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
      const body: EventGetAllDto = request.body;
      const result = await this.eventService.getAll(body);
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
      const result: EventI = await this.eventService.getOne(type, value);
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
      const result = await this.eventService.create(body);
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
      const result = await this.eventService.update(body);
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
      const result = await this.eventService.deleteOne(id);
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
      const result = await this.eventService.deleteAll();
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
