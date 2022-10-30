import { config } from '@core/config';
import { YoutubeApiRootI } from '@youtube';
import axios from 'axios';

export class YoutubeService {
  async search(data: { query: string }) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${data.query}&type=video&key=${config.youtubeToken}`;
      const response = await axios.get<YoutubeApiRootI>(url);
      console.log(response.data);
      const items = [];
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
