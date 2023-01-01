import { ArtistService } from '@artist';
import { EventService } from '@event';
import { MediaService } from '@media';
import { SiteService } from '@site';

export class ResumeService {
  private artistService = new ArtistService();
  private eventService = new EventService();
  private mediaService = new MediaService();
  private siteService = new SiteService();

  async getForAll(): Promise<any> {
    try {
      const artists = await this.artistService.getAll({
        page: 1,
        pageSize: 20,
        hiddenSocial: true,
        order: ['created', 'desc'],
      });
      const events = await this.eventService.getAll({
        page: 1,
        pageSize: 8,
        old: false,
        hiddenSocial: true,
        order: ['date', 'asc'],
      });
      const sets = await this.mediaService.getAll({
        page: 1,
        pageSize: 4,
        type: 'set',
        hiddenSocial: true,
        order: ['created', 'desc'],
      });
      const tracks = await this.mediaService.getAll({
        page: 1,
        pageSize: 4,
        type: 'track',
        hiddenSocial: true,
        order: ['created', 'desc'],
      });
      const clubs = await this.siteService.getAll({
        page: 1,
        pageSize: 15,
        type: 'club',
        hiddenSocial: true,
        order: ['created', 'desc'],
      });
      const festivals = await this.siteService.getAll({
        page: 1,
        pageSize: 15,
        type: 'festival',
        hiddenSocial: true,
        order: ['created', 'desc'],
      });
      return { artists, events, sets, tracks, clubs, festivals };
    } catch (error) {
      return error;
    }
  }
}
