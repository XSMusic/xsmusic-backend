import { NextFunction, Request, Response, Router } from 'express';
import { GeoService } from '@geo';
import { ControllerI } from '@interfaces';
import { HttpException } from '@exceptions';

export class GeoController implements ControllerI {
  path = '/geo';
  router = Router();
  private geoService = new GeoService();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/addressToCoordinates/:address`,
      this.addressToCoordinates
    );
    this.router.get(
      `${this.path}/coordinatesToAddress/:lat/:lng`,
      this.coordinatesToAddress
    );
  }

  private addressToCoordinates = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const address = request.params.address;
      const items = await this.geoService.addressToCoordinates(address);
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
      const lat = request.params.lat;
      const lng = request.params.lng;
      const items = await this.geoService.coordinatesToAddress(lat, lng);
      response.status(200).send(items);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
