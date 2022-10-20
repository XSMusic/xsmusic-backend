import { NextFunction, Request, Response, Router } from 'express';
import { User, UserI } from '@user';
import { HttpException } from 'src/shared/exceptions';
import { ControllerI, RequestExtendedI } from '@interfaces';
import { validationMiddleware, checkUserToken } from '@middlewares';
import { AuthRegisterDto, AuthLogInDto, GoogleUserDto } from './auth.dto';
import { UserWithTokenI, UserTokenI } from './auth.interface';
import { AuthService } from './auth.service';

export class AuthController implements ControllerI {
  path = '/auth';
  router = Router();
  authService = new AuthService();
  user = User;
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(AuthRegisterDto),
      this.registration
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(AuthLogInDto),
      this.login
    );
    this.router.post(
      `${this.path}/loginGoogle`,
      validationMiddleware(GoogleUserDto),
      this.loginGoogle
    );
    this.router.post(`${this.path}/me`, checkUserToken, this.me);
  }

  private registration = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const userData: AuthRegisterDto = request.body;
    try {
      const result: UserWithTokenI = await this.authService.register(userData);
      response.send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private login = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: AuthLogInDto = request.body;
      const result: UserWithTokenI = await this.authService.login(body);
      response.send(result);
    } catch (error) {
      next(
        new HttpException(
          error?.status || 400,
          error.message,
          request,
          response
        )
      );
    }
  };

  private loginGoogle = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const body: GoogleUserDto = request.body;
      const result: UserWithTokenI = await this.authService.loginGoogle(body);
      response.send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };

  private me = async (
    request: RequestExtendedI,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const user: UserTokenI = request.user;
      const result: UserI = await this.authService.me(user);
      response.send(result);
    } catch (error) {
      next(new HttpException(400, error.message, request, response));
    }
  };
}
