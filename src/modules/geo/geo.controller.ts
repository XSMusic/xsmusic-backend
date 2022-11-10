import { NextFunction, Request, Response, Router } from 'express';
import {
  GeoAddressToCoordinatesDto,
  GeoCoordinatesToAddressDto,
  GeoService,
} from '@geo';
import { ControllerI } from '@interfaces';
import { HttpException } from '@exceptions';
import { validationMiddleware } from '@middlewares';

export class GeoController implements ControllerI {
  path = '/geo';
  router = Router();
  private geoService = new GeoService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/addressToCoordinates`,
      validationMiddleware(GeoAddressToCoordinatesDto),
      this.addressToCoordinates
    );
    this.router.post(
      `${this.path}/coordinatesToAddress`,
      validationMiddleware(GeoCoordinatesToAddressDto),
      this.coordinatesToAddress
    );
  }

  private addressToCoordinates = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: GeoAddressToCoordinatesDto = request.body;
      const items = await this.geoService.addressToCoordinates(body);
      response.status(200).send(items);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private coordinatesToAddress = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: GeoCoordinatesToAddressDto = request.body;
      const items = await this.geoService.coordinatesToAddress(body);
      response.status(200).send(items);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
