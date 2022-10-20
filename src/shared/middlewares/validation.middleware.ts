import * as express from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export const validationMiddleware = (type: any): express.RequestHandler => {
  return (req, _res, next) => {
    validate(plainToInstance(type, req.body)).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) => Object.values(error.constraints))
            .join(', ');
          _res.status(400).send({ error: message.toString() });
        } else {
          next();
        }
      }
    );
  };
};
