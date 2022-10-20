import { HttpException } from './http.exception';

export class EmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(
      400,
      `El email ${email} ya existe en nuestra base de datos, prueba con otro`
    );
  }
}
