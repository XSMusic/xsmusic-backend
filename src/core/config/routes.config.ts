import { ArtistController } from '@artist';
import { AuthController } from '@auth';
import { UserController } from '@user';
import { MenuController } from '@menu';
import { StyleController } from '@style';
import { StatsController } from '@stats';
import { ScrapingController } from '@scraping';
import { YoutubeController } from '@youtube';
import { MediaController } from '@media';
import { ClubController } from '@club';

const controllers = [
  new ArtistController(),
  new AuthController(),
  new ClubController(),
  new MediaController(),
  new MenuController(),
  new ScrapingController(),
  new StatsController(),
  new StyleController(),
  new UserController(),
  new YoutubeController(),
];

export const initializeControllers = (app: any) => {
  controllers.forEach((controller) => {
    app.use('/', controller.router);
  });
};
