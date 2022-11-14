import { config } from '@core/config';
import { GeoService } from '@geo';
import { ScrapingSite } from '@scraping';
import { slugify } from '@utils';
import axios from 'axios';
import { load } from 'cheerio';

export class ScrapingSiteService {
  private geoService = new GeoService();
  private url_clubbingspain =
    'https://www.clubbingspain.com/clubs/:poblation/:name.html';

  getInfoSiteClubbingSpain(site: ScrapingSite): Promise<ScrapingSite> {
    return new Promise(async (resolve, reject) => {
      try {
        const urlGoogle = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${site.name}&inputtype=textquery&fields=geometry&key=${config.tokens.map}`;
        const googleResponse = await axios.get(urlGoogle);
        site.address.coordinates = [
          googleResponse.data['candidates'][0].geometry.location['lat'],
          googleResponse.data['candidates'][0].geometry.location['lng'],
        ];

        const geoData = await this.geoService.coordinatesToAddress({
          coordinates: site.address.coordinates,
        });
        site.address.street = geoData.street;
        site.address.town = geoData.town;
        site.address.state = geoData.state;
        site.address.country = geoData.country;
        site = await this.setImageOfClubbingSpain(site);
        resolve(site);
      } catch (e) {
        reject(e);
      }
    });
  }

  async setImageOfClubbingSpain(site: ScrapingSite) {
    try {
      const url = `${this.url_clubbingspain
        .replace(':poblation', slugify(site.address.town))
        .replace(':name', slugify(site.name))}`;
      const response = await axios.get(url);
      const $ = load(response.data);
      site.images.push(
        `https://www.clubbingspain.com${$('img')[3].attribs.src}`
      );
      return site;
    } catch (error) {
      return site;
    }
  }
}
