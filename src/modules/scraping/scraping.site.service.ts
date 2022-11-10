import { ScrapingSite } from '@scraping';
import { slugify } from '@utils';
import axios from 'axios';
import { load } from 'cheerio';

export class ScrapingSiteService {
  private url_clubbingspain =
    'https://www.clubbingspain.com/clubs/:poblation/:name.html';

  getInfoSiteClubbingSpain(site: ScrapingSite): Promise<ScrapingSite> {
    return new Promise(async (resolve, reject) => {
      try {
        const url = `${this.url_clubbingspain
          .replace(':poblation', slugify(site.address.poblation))
          .replace(':name', slugify(site.name))}`;
        const response = await axios.get(url);
        const $ = load(response.data);
        $('.entry-main-content').each(function () {
          if ($(this).html().includes('Dirección:')) {
            const itemsArray = $(this).html().split('<br>');
            itemsArray.forEach((item) => {
              item = item.trim();
              if (item.includes('Dirección:')) {
                console.log('direecccioonnn');
                const iA = item.split('Dirección: <b>');
                console.log(iA);
                const iA2 = iA[1].split('</b>');
                site.address.street = iA2[0].trim();
              }
            });
          }
        });
        resolve(site);
      } catch (e) {
        reject(e);
      }
    });
  }
}
