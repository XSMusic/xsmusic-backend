import { config } from '@core/config';
import { YoutubeApiRootI, YoutubeI } from '@youtube';
import axios from 'axios';

export class YoutubeService {
  async searchByText(data: { query: string }): Promise<YoutubeI[]> {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${data.query}&type=video&key=${config.tokens.youtube}`;
      const response = await axios.get<YoutubeApiRootI>(url);
      const items: YoutubeI[] = [];
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
