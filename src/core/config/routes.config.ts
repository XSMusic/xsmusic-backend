import { ArtistController } from "@artist";
import { AuthController } from "@auth";
import { UserController } from "@user";
import { MenuController } from '@menu';

const controllers = [
    new ArtistController(),
    new AuthController(),
    new MenuController(),
    new UserController(),
];

export const initializeControllers = (app: any) => {
  controllers.forEach((controller) => {
    app.use("/", controller.router);
  });
};
