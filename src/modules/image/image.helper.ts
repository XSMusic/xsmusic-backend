import { config } from '@config';
import { Image, ImageI, ImageUploadByUrlDto } from '@image';
import { MessageI } from '@interfaces';
import { downloadImageFromUrl } from '@utils';
import fs from 'fs';
import sharp from 'sharp';

export class ImageHelper {
  downloadAndUploadImageFromUrl(data: ImageUploadByUrlDto): Promise<string> {
    return new Promise(async (resolve) => {
      try {
        const filePath = `${config.paths.uploads}/${data.type}s/${data.id}_${data.position}.jpg`;
        const urlNew = await downloadImageFromUrl(data.url, filePath);
        console.log(urlNew);
        resolve(urlNew);
      } catch (error) {
        console.error(error);
        resolve(error);
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
          fs.unlinkSync(`${config.paths.uploads}/${image.type}s/${image.url}`);
          resolve({ message: 'Imagenes creadas correctamente' });
        } else {
          reject({ message: 'La imagen no existe' });
        }
      } catch (error) {
        this.deleteOne(id, true);
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
    await sharp(`${config.paths.uploads}/${image.type}s/${image.url}`, {
      failOnError: false,
    })
      .resize({ width: width, fit: sharp.fit.inside, withoutEnlargement: true })
      .jpeg({ quality: 70 })
      .toFile(this.getPath(image, folder));
  }

  private getPath(image: ImageI, type: 'small' | 'medium' | 'big') {
    return `${config.paths.uploads}/${image.type}s/${type}/${image.url}`;
  }

  async deleteOne(id: string, force = false): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const item = await Image.findById(id).exec();
        const response = await Image.findByIdAndDelete(id).exec();
        if (response) {
          fs.unlinkSync(`${config.paths.uploads}/${item.url}`);
          resolve({ message: 'Imagen eliminada' });
        } else {
          reject({ message: 'Imagen no existe en la BD' });
        }
      } catch (error) {
        if (force) {
          resolve({ message: 'Imagen no existe' });
        } else {
          reject({ message: 'Imagen no existe' });
        }
      }
    });
  }

  async deleteByTypeId(data: {
    type: 'artist' | 'event' | 'media' | 'site' | 'user';
    id: string;
  }) {
    try {
      const images = await Image.find({
        [data.type]: data.id,
      }).exec();

      for (const image of images) {
        fs.unlinkSync(`${config.paths.uploads}/small/${image.url}`);
        fs.unlinkSync(`${config.paths.uploads}/medium/${image.url}`);
        fs.unlinkSync(`${config.paths.uploads}/big/${image.url}`);
        await Image.findByIdAndDelete(image._id).exec();
      }
      return { message: `${images.length} Imagenes eliminadas` };
    } catch (error) {
      return error;
    }
  }
}
