import { config } from '@config';
import { Image, ImageI, ImageUploadByUrlDto } from '@image';
import { MessageI } from '@interfaces';
import { downloadImageFromUrl } from '@utils';
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

  downloadAndUploadImageFromUrl(data: ImageUploadByUrlDto): Promise<string> {
    return new Promise(async (resolve) => {
      try {
        const filePath = `${config.paths.uploads}/${data.type}s/${data.id}_${data.position}.png`;
        const urlNew = await downloadImageFromUrl(data.url, filePath);
        resolve(urlNew);
      } catch (error) {
        console.error(error);
        resolve(null);
      }
    });
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
    return `${config.paths.uploads}/${image.type}s/${type}/${image.url}`;
  }
}
