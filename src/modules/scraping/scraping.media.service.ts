import { config } from '@config';
import {
  ScrapingGetListMediaDto,
  ScrapingMediaYoutubeI,
  YoutubeApiRootI,
} from '@scraping';
import axios from 'axios';

export class ScrapingMediaService {
  async getYoutubeList(
    data: ScrapingGetListMediaDto
  ): Promise<ScrapingMediaYoutubeI[]> {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${data.maxResults}&q=${data.query}&type=video&key=${config.tokens.youtube}`;
      const response = await axios.get<YoutubeApiRootI>(url);
      const items: ScrapingMediaYoutubeI[] = [];
      for (const item of response.data.items) {
        items.push({
          name: item.snippet.title,
          channel: {
            id: item.snippet.channelId,
            name: item.snippet.channelTitle,
          },
          videoId: item.id.videoId,
          info: item.snippet.description,
          image: item.snippet.thumbnails.high.url,
        });
      }
      return items;
    } catch (e) {
      return e;
    }
  }
}
