import { IdDto } from '@dtos';
import { HttpException } from '@exceptions';
import { ControllerI } from '@interfaces';
import { MenuService } from '@menu';
import { NextFunction, Request, Response, Router } from 'express';

export class MenuController implements ControllerI {
  path = '/menu';
  router = Router();
  private menuService = new MenuService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/`, this.getMenu);
    this.router.post(`${this.path}/getAll`, this.getAll);
    this.router.post(`${this.path}/getOne`, this.getOne);
    this.router.post(`${this.path}/create`, this.create);
    this.router.put(`${this.path}/update`, this.update);
    this.router.delete(`${this.path}/one/:id`, this.deleteOne);
  }

  private getMenu = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const items = await this.menuService.getMenu();
      response.status(200).send(items);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private getAll = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const items = await this.menuService.getAll();
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
      const body: IdDto = request.body;
      const items = await this.menuService.getOne(body.id);
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
      const body = request.body;
      const item = await this.menuService.create(body);
      response.status(200).send(item);
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
      const item = await this.menuService.update(body);
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
      const body: IdDto = request.body;
      const item = await this.menuService.deleteOne(body.id);
      response.status(200).send(item);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
