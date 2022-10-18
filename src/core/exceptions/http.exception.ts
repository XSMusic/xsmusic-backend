import { Logger } from '@services';
import { Request, Response } from 'express';

export class HttpException extends Error {
  status: number;
  message: string;
  constructor(
    status: number,
    message: string,
    request?: Request,
    response?: Response
  ) {
    super(message);
    this.status = status;
    this.message = message;
    Logger.error(`Error${' ' + this.status}: ${message?.toString()}`);
    if (response) {
      response.status(status).send({
        status,
        message,
      });
    }
  }
}
