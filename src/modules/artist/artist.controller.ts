import { NextFunction, Request, Response, Router } from 'express';
import { ArtistService } from '@artist';
import { ControllerI } from '@interfaces';
import { HttpException } from '@exceptions';

export class ArtistController implements ControllerI {
   path = '/artists';
   router = Router();
   private artistService = new ArtistService();
   constructor() {
       this.initializeRoutes();
   }

   private initializeRoutes() {
   this.router.get(
       `${this.path}/getAll`,
       this.getAll
   );
}

   private getAll = async (
       request: Request,
       response: Response,
       next: NextFunction
   ) => {
     try {
         const items = await this.artistService.scrapy();
         response.status(200).send(items);
     } catch (error) {
         next(new HttpException(400, error.message, request, response));
     }
 };
}