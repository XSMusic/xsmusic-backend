import compression from 'compression';
import cors from 'cors';
import methodOverride from 'method-override';
import express from 'express';
import serveIndex from 'serve-index';
import bodyParser from 'body-parser';
import promBundle from 'express-prom-bundle';
import { config } from '../../core/config/app.config';


export class AppService {
  private app: express.Application;
  private pathUploads = config.paths.uploads;
  constructor(app: express.Application) {
    this.app = app;
  }

  enablePromClient(app: express.Application): void {
    const regUploads = /(?<=[^w/]|^)[w/]uploads/;
    const regAdmin = /(?<=[^w/]|^)[w/]admin/;
    const regApp = /(?<=[^w/]|^)[w/]app/;
    const originalNormalize = promBundle.normalizePath;
    const metricsMiddleware = promBundle({
      includeMethod: true,
      includePath: true,
      excludeRoutes: [regUploads, regAdmin, regApp],
      promClient: {
        collectDefaultMetrics: {},
      },
      formatStatusCode: (res: any) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          return '2xx';
        } else if (res.statusCode >= 400 && res.statusCode < 500) {
          return '4xx';
        }
        return '5xx';
      },
      normalizePath: (req: any, opts: any) => {
        const path = originalNormalize(req, opts);
        return path;
      },
    });
    app.use(metricsMiddleware);
  }

  initStaticRoutes(app: express.Application): void {
    app.use('/uploads', serveIndex(`${this.pathUploads}`));
    app.use(
      '/uploads',
      express.static(`${this.pathUploads}`, { redirect: true })
    );
    app.use(
      '/.well-known',
      express.static('.well-known'),
      serveIndex('.well-known')
    );
  }

  initMiddlewares() {
    const optionsCors = {
      origin: '*',
      exposedHeaders: [
        'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method',
      ],
      credentials: true,
    };
    this.app.use(cors(optionsCors));
    this.app.use(compression());
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(methodOverride());
  }
    
//   initializeErrorHandling() {
//     process.on('unhandledRejection', (reason: string, p: Promise<any>) => {
//       Logger.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
//     });

//     process.on('uncaughtException', (error: Error) => {
//       Logger.error('Uncaught Exception thrown:', error);
//     });
//   }

}
