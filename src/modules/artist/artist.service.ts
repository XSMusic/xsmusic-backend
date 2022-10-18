import { ArtistHelper } from "@artist";

export class ArtistService {
    private artistHelper = new ArtistHelper();

 async scrapy(): Promise<any> {
     try {
         await this.artistHelper.scrapingArtists()
         return { 'perro': 'gato'};
     } catch (error) {
         return error;
     }
 }
}