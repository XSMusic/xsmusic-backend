import express from "express";
import { AppService } from "./shared/services/app.service";
import { config } from "./core/config/app.config";
import { Logger } from "@services";
import { initializeControllers } from "@config";
// import { connectToDB } from "./db";

const app = express();
const appService = new AppService(app);
const env = config.env;

const init = () => {
//   connectToDB();
//   appService.enablePromClient(app);
//   appService.initStaticRoutes(app);
//   appService.initMiddlewares();
  initializeControllers(app);
//   appService.initializeErrorHandling();
//   appService.initMonitor();
//   if (env !== "test") {
//     appService.initCrontab();
    app.listen(config.port, () => {
      Logger.info(`[Server] ${config.title} ${config.env}`);
    });
//   }
};

init();

export default app;
