import {
  ScrapingArtist,
  ScrapingArtistService,
  ScrapingDiscarts,
  ScrapingDiscartsI,
  ScrapingEventService,
  ScrapingEventsI,
  ScrapingGetInfoArtistDto,
  ScrapingGetInfoClubDto,
  ScrapingGetListEventsDto,
  ScrapingGetListMediaDto,
  ScrapingMediaService,
  ScrapingMediaYoutubeI,
  ScrapingSite,
  ScrapingSiteService,
  ScrapingSoundcloudService,
  ScrapingYoutubeService,
} from '@scraping';

export class ScrapingService {
  private scrapingArtist = new ScrapingArtistService();
  private scrapingSite = new ScrapingSiteService();
  private scrapingEvent = new ScrapingEventService();
  private scrapingMedia = new ScrapingMediaService();
  private scrapingSoundcloud = new ScrapingSoundcloudService();
  private scrapingYoutube = new ScrapingYoutubeService();

  getInfoArtist(body: ScrapingGetInfoArtistDto): Promise<ScrapingArtist> {
    return new Promise(async (resolve, reject) => {
      try {
        let artist = new ScrapingArtist(body.name);
        artist = await this.scrapingArtist.getInfoArtistDJRankings(artist);
        artist = await this.scrapingArtist.getInfoArtistWikipedia(artist);
        artist = await this.scrapingArtist.getInfoArtistClubbing(artist, body);
        resolve(artist);
      } catch (error) {
        reject(error);
      }
    });
  }

  async searchNameSoundcloud(name: string) {
    try {
      return await this.scrapingSoundcloud.searchName(name);
    } catch (error) {
      return error;
    }
  }

  async searchNameYoutube(name: string) {
    try {
      return await this.scrapingYoutube.searchName(name);
    } catch (error) {
      return error;
    }
  }

  async getInfoClub(body: ScrapingGetInfoClubDto): Promise<ScrapingSite> {
    try {
      let club = new ScrapingSite(body.name, body.poblation);
      club = await this.scrapingSite.getInfoSiteClubbingSpain(club);
      return club;
    } catch (error) {
      return error;
    }
  }

  async getListMedia(
    data: ScrapingGetListMediaDto
  ): Promise<ScrapingMediaYoutubeI[]> {
    try {
      if (data.source === 'youtube') {
        const items = await this.scrapingMedia.getYoutubeList(data);
        return items;
      }
    } catch (e) {
      return e;
    }
  }

  async getListEvents(
    data: ScrapingGetListEventsDto
  ): Promise<ScrapingEventsI> {
    try {
      if (data.source === 'ra') {
        const items = await this.scrapingEvent.getEventsListRA(data);
        return items;
      }
    } catch (e) {
      return e;
    }
  }

  async getEventsBySiteId(id: string): Promise<any> {
    try {
      const items = await this.scrapingEvent.getEventsBySiteId(id);
      return items;
    } catch (e) {
      return e;
    }
  }

  async createDiscart(body: ScrapingDiscartsI): Promise<ScrapingDiscartsI> {
    return new Promise(async (resolve, reject) => {
      try {
        const item = new ScrapingDiscarts(body);
        const itemDB = await item.save();
        if (itemDB) {
          resolve(itemDB);
        } else {
          reject({ message: 'El descarte no ha sido creado' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
