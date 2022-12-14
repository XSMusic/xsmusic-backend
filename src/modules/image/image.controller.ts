import { NextFunction, Request, Response, Router } from 'express';
import { HttpException } from '@exceptions';
import { ControllerI } from '@interfaces';
import {
  validationMiddleware,
  checkAdminToken,
  multerMiddleware,
  checkUserToken,
} from '@middlewares';
import {
  ImageGetAllDto,
  ImageResizeAllDto,
  ImageService,
  ImageSetFirstImageDto,
  ImageUpdateDto,
  ImageUploadByUrlDto,
  ImageUploadDto,
} from '@image';

export class ImageController implements ControllerI {
  path = '/images';
  router = Router();

  private imageService = new ImageService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/getAll`,
      validationMiddleware(ImageGetAllDto),
      checkAdminToken,
      this.getAll
    );
    this.router.post(
      `${this.path}/upload`,
      [multerMiddleware.single('image'), checkUserToken],
      this.upload
    );
    this.router.post(
      `${this.path}/uploadByUrl`,
      validationMiddleware(ImageUploadByUrlDto),
      checkUserToken,
      this.uploadByUrl
    );
    this.router.put(
      `${this.path}/update`,
      validationMiddleware(ImageUpdateDto),
      checkUserToken,
      this.update
    );
    this.router.put(
      `${this.path}/setFirstImage`,
      validationMiddleware(ImageSetFirstImageDto),
      checkUserToken,
      this.setFirstImage
    );
    this.router.post(
      `${this.path}/resizeAllImages`,
      validationMiddleware(ImageResizeAllDto),
      checkAdminToken,
      this.resizeAllImages
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
      const body: ImageGetAllDto = request.body;
      const result = await this.imageService.getAll(body);
      response.status(200).json(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private upload = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: ImageUploadDto = request.body;
      const result = await this.imageService.upload(body, request.file);
      response.status(200).json(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private uploadByUrl = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: ImageUploadByUrlDto = request.body;
      const result = await this.imageService.uploadByUrl(body);
      response.status(200).json(result);
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
      const body: ImageUpdateDto = request.body;
      const item = await this.imageService.update(body);
      response.status(200).send(item);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private setFirstImage = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: ImageSetFirstImageDto = request.body;
      const item = await this.imageService.setFirstImage(body);
      response.status(200).send(item);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private resizeAllImages = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: ImageResizeAllDto = request.body;
      const item = await this.imageService.resizeAllImages(body);
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
      const result = await this.imageService.deleteOne(id);
      response.status(200).json(result);
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
      const result = await this.imageService.deleteAll();
      response.status(200).json(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
