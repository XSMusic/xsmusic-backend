import { NextFunction, Request, Response, Router } from 'express';
import {
  DynamicFormCreateFormDto,
  DynamicFormCreateItemDto,
  DynamicFormService,
} from '@dynamicForm';
import { ControllerI } from '@interfaces';
import { HttpException } from '@exceptions';
import { checkAdminToken, validationMiddleware } from '@middlewares';
import { GetAllDto } from '@dtos';

export class DynamicFormController implements ControllerI {
  path = '/dynamicForm';
  router = Router();
  private dynamicFormService = new DynamicFormService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/getAll`,
      validationMiddleware(GetAllDto),
      this.getAll
    );
    this.router.get(`${this.path}/getOne/:type/:id`, this.getOne);
    this.router.post(
      `${this.path}/createForm`,
      validationMiddleware(DynamicFormCreateFormDto),
      checkAdminToken,
      this.createForm
    );
    this.router.post(
      `${this.path}/createFormItem`,
      validationMiddleware(DynamicFormCreateItemDto),
      checkAdminToken,
      this.createFormItem
    );
    this.router.put(
      `${this.path}/updateForm`,
      // validationMiddleware(ArtistUpdateDto),
      checkAdminToken,
      this.updateForm
    );
    this.router.put(
      `${this.path}/updateFormItem`,
      // validationMiddleware(ArtistUpdateDto),
      checkAdminToken,
      this.updateFormItem
    );
    this.router.delete(
      `${this.path}/one/:type/:id`,
      checkAdminToken,
      this.deleteOne
    );
  }

  private getAll = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const data: GetAllDto = request.body;
      const items = await this.dynamicFormService.getAll(data);
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
      const type = request.params.type;
      const id = request.params.id;
      const items = await this.dynamicFormService.getOne(type, id);
      response.status(200).send(items);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private createForm = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: any = request.body;
      const result = await this.dynamicFormService.createForm(body);
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private createFormItem = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: DynamicFormCreateItemDto = request.body;
      const result = await this.dynamicFormService.createFormItem(body);
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private updateForm = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body = request.body;
      const result = await this.dynamicFormService.updateForm(body);
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private updateFormItem = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body = request.body;
      const result = await this.dynamicFormService.updateFormItem(body);
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
      const type = request.params.type;
      const id = request.params.id;
      const result = await this.dynamicFormService.deleteOne(type, id);
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
