import { NextFunction, Request, Response, Router } from "express";
import {
  ArtistCreateDto,
  ArtistGetAllDto,
  ArtistI,
  ArtistService,
  ArtistUpdateDto,
} from "@artist";
import { ControllerI } from "@interfaces";
import { HttpException } from "src/shared/exceptions";
import { checkAdminToken, validationMiddleware } from "@middlewares";
import { IdDto, SearchDto, SlugDto } from "@dtos";

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
      validationMiddleware(ArtistGetAllDto),
      this.getAll
    );
    this.router.post(
      `${this.path}/getOneById`,
      validationMiddleware(IdDto),
      this.getOneById
    );
    this.router.post(
      `${this.path}/getOneBySlug`,
      validationMiddleware(SlugDto),
      this.getOneBySlug
    );
    this.router.post(
      `${this.path}/search`,
      [validationMiddleware(SearchDto)],
      this.search
    );
    this.router.post(
      `${this.path}/create`,
      validationMiddleware(ArtistCreateDto),
      this.create
    );
    this.router.put(
      `${this.path}/update`,
      validationMiddleware(ArtistUpdateDto),
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
      const body: ArtistGetAllDto = request.body;
      const result = await this.artistService.getAll(body);
      response.status(200).send(result);
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
      const result: ArtistI = await this.artistService.getOneById(body);
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private getOneBySlug = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: SlugDto = request.body;
      const result: ArtistI = await this.artistService.getOneBySlug(body);
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
      const items = await this.artistService.search(body);
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
