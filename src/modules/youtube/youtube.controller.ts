import { NextFunction, Request, Response, Router } from 'express';
import { YoutubeSearchDto, YoutubeService } from '@youtube';
import { ControllerI } from '@interfaces';
import { HttpException } from '@exceptions';
import { validationMiddleware } from '@middlewares';

export class YoutubeController implements ControllerI {
  path = '/youtube';
  router = Router();
  private youtubeService = new YoutubeService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/search`,
      validationMiddleware(YoutubeSearchDto),
      this.getAll
    );
  }

  private getAll = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: YoutubeSearchDto = request.body;
      const items = await this.youtubeService.search(body);
      response.status(200).send(items);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
