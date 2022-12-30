import { ArtistController } from '@artist';
import { AuthController } from '@auth';
import { UserController } from '@user';
import { MenuController } from '@menu';
import { StyleController } from '@style';
import { StatsController } from '@stats';
import { ScrapingController } from '@scraping';
import { MediaController } from '@media';
import { SiteController } from '@site';
import { GeoController } from '@geo';
import { ImageController } from '@image';
import { EventController } from '@event';
import { GithubController } from '@github';
import { SystemController } from '@system';
import { LikeController } from '@like';

const controllers = [
  new ArtistController(),
  new AuthController(),
  new EventController(),
  new GeoController(),
  new GithubController(),
  new MediaController(),
  new MenuController(),
  new ImageController(),
  new LikeController(),
  new ScrapingController(),
  new StatsController(),
  new SiteController(),
  new StyleController(),
  new SystemController(),
  new UserController(),
];

export const initializeControllers = (app: any) => {
  controllers.forEach((controller) => {
    app.use('/', controller.router);
  });
};
