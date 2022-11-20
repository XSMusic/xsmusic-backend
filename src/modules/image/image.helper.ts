import { config } from '@config';
import { Image } from '@image';
import fs from 'fs';

export class ImageHelper {
  async deleteByTypeId(data: {
    type: 'artist' | 'event' | 'media' | 'site' | 'user';
    id: string;
  }) {
    try {
      const images = await Image.find({
        [data.type]: data.id,
      }).exec();

      for (const image of images) {
        fs.unlink(`${config.paths.uploads}/${image.url}`, async () => {
          await Image.findByIdAndDelete(image._id).exec();
        });
      }
      return { message: `${images.length} Imagenes eliminadas` };
    } catch (error) {
      return error;
    }
  }
}
