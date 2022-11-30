import { config } from '@config';
import { Media } from '@media';
import {
  ScrapingDiscarts,
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
      const media = (
        await Media.find({ source: 'youtube' }).select('sourceId').exec()
      ).map((item) => item.sourceId);
      const discarts = (
        await ScrapingDiscarts.find({ source: 'youtube' }).exec()
      ).map((item) => item.value);
      for (const item of response.data.items) {
        if (
          !discarts.includes(item.id.videoId) &&
          !media.includes(item.id.videoId)
        ) {
          // Comprobar que no existe el id en db
          const data = {
            name: item.snippet.title,
            channel: {
              id: item.snippet.channelId,
              name: item.snippet.channelTitle,
            },
            videoId: item.id.videoId,
            info: item.snippet.description,
            image: item.snippet.thumbnails.high.url,
          };

          items.push(data);
        }
      }
      return items;
    } catch (e) {
      return e;
    }
  }
}
