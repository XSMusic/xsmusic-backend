import { Request } from 'express';

export interface RequestExtendedI extends Request {
  user?: any;
}
