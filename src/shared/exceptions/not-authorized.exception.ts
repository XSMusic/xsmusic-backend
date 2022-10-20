import { Request } from 'express';
import { HttpException } from './http.exception';

export class NotAuthorizedException extends HttpException {
  constructor(request?: Request) {
    super(999, '¡No estas autorizado!', request);
  }
}
