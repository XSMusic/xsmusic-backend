import {
  ScrapingArtist,
  ScrapingArtistService,
  ScrapingGetInfoArtistDto,
} from '@scraping';

export class ScrapingService {
  private scrapingArtist = new ScrapingArtistService();

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
}
