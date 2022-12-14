import { ScrapingSoundcloudI } from '@scraping';
import { config } from '@config';
import axios from 'axios';

export class ScrapingSoundcloudService {
  private urlSoundcloudSearch = `https://api-v2.soundcloud.com/search?q=:searchText&client_id=${config.tokens.soundcloud}&limit=20&offset=0'`;

  searchName(name: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get<ScrapingSoundcloudI>(
          this.urlSoundcloudSearch.replace(':searchText', name)
        );
        const items: any[] = [];
        for (const item of response.data.collection) {
          if (item.full_name) {
            items.push({
              name: item.full_name,
              image: item.avatar_url,
              country: item.country_code,
              url: item.permalink_url,
            });
          }
        }
        resolve(items);
      } catch (e) {
        reject(e);
      }
    });
  }
}
