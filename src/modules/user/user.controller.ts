import { NextFunction, Request, Response, Router } from 'express';
import {
  UserCreateDto,
  UserGetAllDto,
  UserI,
  UserService,
  UserUpdateDto,
} from '@user';
import { ControllerI } from '@interfaces';
import { HttpException } from 'src/shared/exceptions';
import { IdDto } from '@dtos';
import {
  validationMiddleware,
  checkAdminToken,
  checkUserToken,
} from '@middlewares';

export class UserController implements ControllerI {
  path = '/users';
  router = Router();
  private userService = new UserService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/getAll`,
      validationMiddleware(UserGetAllDto),
      checkAdminToken,
      this.getAll
    );
    this.router.post(
      `${this.path}/one`,
      [validationMiddleware(IdDto), checkAdminToken],
      this.getOne
    );
    this.router.post(
      `${this.path}/create`,
      [validationMiddleware(UserCreateDto), checkAdminToken],
      this.create
    );
    this.router.put(
      `${this.path}/update`,
      validationMiddleware(UserUpdateDto),
      checkUserToken,
      this.update
    );
    this.router.delete(`${this.path}/one/:id`, checkAdminToken, this.deleteOne);
    this.router.delete(
      `${this.path}/allFake`,
      checkAdminToken,
      this.deleteAllFake
    );
  }

  private getAll = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: UserGetAllDto = request.body;
      const items = await this.userService.getAll(body);
      response.status(200).send(items);
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
      const id = request.body.id;
      const item: UserI = await this.userService.getOne(id);
      response.status(200).send(item);
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
      const body = request.body;
      const user = await this.userService.create(body);
      response.status(200).send(user);
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
      const item = await this.userService.update(body);
      response.status(200).send(item);
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
      const item = await this.userService.deleteOne(id);
      const message = item
        ? `Usuario ${id} eliminado`
        : `Usuario ${id} no existe`;
      response.status(200).send({ message });
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private deleteAllFake = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.userService.deleteAllFake();
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
