import { config } from '@config';
import { Media } from '@media';
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
      const media = await Media.find({ source: 'youtube' })
        .select('sourceId')
        .exec();
      console.log(media.length);
      for (const item of response.data.items) {
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

        //   console.log(media.find(''));
        // if (
        console.log(
          media.find((mediaIDB) => {
            console.log(
              mediaIDB.sourceId.toString(),
              data.videoId.toString(),
              mediaIDB.sourceId.toString() === data.videoId.toString()
            );
            return mediaIDB.sourceId.toString() !== data.videoId.toString();
          })
        );
        // ) {
        // }
        items.push(data);
      }
      return items;
    } catch (e) {
      return e;
    }
  }
}
