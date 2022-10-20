import { Request } from 'express';
import { HttpException } from './http.exception';

export class WrongCredentialsException extends HttpException {
  constructor(request?: Request) {
    super(401, 'Email/Contraseña invalido', request);
  }
}
