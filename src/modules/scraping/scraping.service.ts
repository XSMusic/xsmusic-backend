import {
  ScrapingArtist,
  ScrapingArtistService,
  ScrapingGetInfoArtistDto,
  ScrapingGetInfoClubDto,
  ScrapingSite,
  ScrapingSiteService,
} from '@scraping';

export class ScrapingService {
  private scrapingArtist = new ScrapingArtistService();
  private scrapingSite = new ScrapingSiteService();

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

  async getInfoClub(body: ScrapingGetInfoClubDto): Promise<ScrapingSite> {
    try {
      let club = new ScrapingSite(body.name, body.poblation);
      club = await this.scrapingSite.getInfoSiteClubbingSpain(club);
      return club;
    } catch (error) {
      return error;
    }
  }
}
