import { Logger } from '@services';
import path from 'path';
import sharp from 'sharp';

export class Resize {
  pathImage: string;
  constructor(folder: string) {
    this.pathImage = folder;
  }

  async save(buffer: Buffer): Promise<string> {
    try {
      const filepath = this.filepath();
      await sharp(buffer)
        .resize({
          width: 800,
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .jpeg({ quality: 60 })
        .toFile(filepath);

      return filepath;
    } catch (error) {
      Logger.error(error);
    }
  }

  filepath() {
    return path.resolve(`${this.pathImage}`);
  }
}
