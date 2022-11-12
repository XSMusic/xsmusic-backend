import { NextFunction, Request, Response, Router } from 'express';
import { ScrapingService } from '@scraping';
import { ControllerI } from '@interfaces';
import { HttpException } from '@exceptions';
import {
  ScrapingGetInfoArtistDto,
  ScrapingGetInfoClubDto,
} from './scraping.dto';
import { validationMiddleware } from '@middlewares';

export class ScrapingController implements ControllerI {
  path = '/scraping';
  router = Router();
  private scrapingService = new ScrapingService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/getInfoArtist`,
      validationMiddleware(ScrapingGetInfoArtistDto),
      this.getInfoArtist
    );
    this.router.post(
      `${this.path}/getInfoClub`,
      validationMiddleware(ScrapingGetInfoClubDto),
      this.getInfoClub
    );
  }

  private getInfoArtist = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: ScrapingGetInfoArtistDto = request.body;
      const items = await this.scrapingService.getInfoArtist(body);
      response.status(200).send(items);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private getInfoClub = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: ScrapingGetInfoClubDto = request.body;
      const items = await this.scrapingService.getInfoClub(body);
      response.status(200).send(items);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
