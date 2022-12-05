import { config } from '@config';
import { Image, ImageI } from '@image';
import { MessageI } from '@interfaces';
import fs from 'fs';
import sharp from 'sharp';

// TODO: Al subir imagen, hacer resize

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

  resizeImage(id: string): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const image = await Image.findById(id).exec();
        if (image) {
          await this.resizeWithResolution(image, 'small');
          await this.resizeWithResolution(image, 'medium');
          await this.resizeWithResolution(image, 'big');
          resolve({ message: 'OK bro ' });
        } else {
          reject({ message: 'La imagen no existe' });
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  private async resizeWithResolution(
    image: ImageI,
    folder: 'small' | 'medium' | 'big'
  ) {
    let width = 0;
    if (folder === 'small') {
      width = 100;
    } else if (folder === 'medium') {
      width = 320;
    } else if (folder === 'big') {
      if (image.type === 'event') {
        width = 1200;
      } else {
        width = 800;
      }
    }
    await sharp(`${config.paths.uploads}/${image.url}`)
      .resize({ width: width, fit: sharp.fit.inside, withoutEnlargement: true })
      .jpeg({ quality: 70 })
      .toFile(this.getPath(image, folder));
  }

  private getPath(image: ImageI, type: 'small' | 'medium' | 'big') {
    const filePath = image.url.split(`${image.type}s/`)[1];
    return `${config.paths.uploads}/${image.type}s/${type}/${filePath}`;
  }
}
