import { Router } from 'express';

export interface ControllerI {
  path: string;
  router: Router;
}
