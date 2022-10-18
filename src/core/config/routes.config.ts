import { ArtistController } from "@artist";

const controllers = [
  new ArtistController(),
];

export const initializeControllers = (app: any) => {
  controllers.forEach((controller) => {
    app.use("/", controller.router);
  });
};
