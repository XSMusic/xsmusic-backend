import { NextFunction, Request, Response, Router } from 'express';
import {
  EventI,
  EventService,
  EventCreateDto,
  EventGetAllDto,
  EventUpdateDto,
  EventGetAllForTypeDto,
} from '@event';
import { ControllerI, RequestExtendedI } from '@interfaces';
import { HttpException } from '@exceptions';
import {
  checkAdminToken,
  checkUserNotObligatory,
  validationMiddleware,
} from '@middlewares';
import { GetAllDto, GetOneDto } from '@dtos';

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
      [validationMiddleware(GetAllDto), checkUserNotObligatory],
      this.getAll
    );
    this.router.post(
      `${this.path}/getAllForType`,
      [validationMiddleware(EventGetAllForTypeDto), checkUserNotObligatory],
      this.getAllForType
    );
    this.router.post(
      `${this.path}/getOne`,
      [validationMiddleware(GetOneDto), checkUserNotObligatory],
      this.getOne
    );
    this.router.post(
      `${this.path}/create`,
      [checkAdminToken, validationMiddleware(EventCreateDto)],
      this.create
    );
    this.router.put(
      `${this.path}/update`,
      [checkAdminToken, validationMiddleware(EventUpdateDto)],
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
      const body: EventGetAllDto = request.body;
      const result = await this.eventService.getAll(body, request.user);
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private getAllForType = async (
    request: RequestExtendedI,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: EventGetAllForTypeDto = request.body;
      const result = await this.eventService.getAllForType(body, request.user);
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
      const result: EventI = await this.eventService.getOne(body, request.user);
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
