import {
  ScrapingArtist,
  ScrapingArtistService,
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
} from '@scraping';

export class ScrapingService {
  private scrapingArtist = new ScrapingArtistService();
  private scrapingSite = new ScrapingSiteService();
  private scrapingEvent = new ScrapingEventService();
  private scrapingMedia = new ScrapingMediaService();

  async getInfoArtist(body: ScrapingGetInfoArtistDto): Promise<ScrapingArtist> {
    try {
      let artist = new ScrapingArtist(body.name);
      artist = await this.scrapingArtist.getInfoArtistDJRankings(artist);
      artist = await this.scrapingArtist.getInfoArtistWikipedia(artist);
      artist = await this.scrapingArtist.getInfoArtistClubbing(artist, body);
      return artist;
    } catch (error) {
      return error;
    }
  }

  searchNameSoundcloud(name: string) {
    try {
      return this.scrapingArtist.searchNameSoundcloud(name);
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
}
