import { ArtistController } from "@artist";
import { AuthController } from "@auth";
import { UserController } from "@user";
import { MenuController } from '@menu';
import { StyleController } from '@style';

const controllers = [
    new ArtistController(),
    new AuthController(),
    new MenuController(),
    new StyleController(),
    new UserController(),
];

export const initializeControllers = (app: any) => {
  controllers.forEach((controller) => {
    app.use("/", controller.router);
  });
};
