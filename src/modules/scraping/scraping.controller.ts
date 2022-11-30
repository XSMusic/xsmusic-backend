import { NextFunction, Request, Response, Router } from 'express';
import { ScrapingService } from '@scraping';
import { ControllerI } from '@interfaces';
import { HttpException } from '@exceptions';
import {
  ScrapingGetInfoArtistDto,
  ScrapingGetInfoClubDto,
  ScrapingGetListEventsDto,
  ScrapingGetListMediaDto,
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
      `${this.path}/searchNameSoundcloud`,
      this.searchNameSoundcloud
    );
    this.router.post(
      `${this.path}/getInfoClub`,
      validationMiddleware(ScrapingGetInfoClubDto),
      this.getInfoClub
    );
    this.router.post(
      `${this.path}/getListMedia`,
      validationMiddleware(ScrapingGetListMediaDto),
      this.getListMedia
    );
    this.router.post(
      `${this.path}/getListEvents`,
      validationMiddleware(ScrapingGetListEventsDto),
      this.getListEvents
    );
    this.router.post(`${this.path}/createDiscart`, this.createDiscart);
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

  private searchNameSoundcloud = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: { name: string } = request.body;
      const items = await this.scrapingService.searchNameSoundcloud(body.name);
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

  private getListMedia = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: ScrapingGetListMediaDto = request.body;
      const items = await this.scrapingService.getListMedia(body);
      response.status(200).send(items);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private getListEvents = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: ScrapingGetListEventsDto = request.body;
      const items = await this.scrapingService.getListEvents(body);
      response.status(200).send(items);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private createDiscart = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: any = request.body;
      const result = await this.scrapingService.createDiscart(body);
      response.status(200).send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
