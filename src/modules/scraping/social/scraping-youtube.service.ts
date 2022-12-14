import { config } from '@config';
import { ScrapingSearchNameYoutubeI, YoutubeApiRootI } from '@scraping';
import axios from 'axios';

export class ScrapingYoutubeService {
  searchName(name: string): Promise<ScrapingSearchNameYoutubeI[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const url = `https://youtube.googleapis.com/youtube/v3/search?key=${config.tokens.youtube}&q=${name}&type=channel&part=snippet`;
        const response = await axios.get<YoutubeApiRootI>(url);
        const channels = [];
        for (const item of response.data.items) {
          channels.push({
            id: item.id.channelId,
            name: item.snippet.title,
            image: item.snippet.thumbnails.high.url,
          });
        }
        resolve(channels);
      } catch (error) {
        reject(error);
      }
    });
  }
}
