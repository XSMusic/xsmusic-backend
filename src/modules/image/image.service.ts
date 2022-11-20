import { MessageI, PaginatorI } from '@interfaces';
import {
  ImageI,
  ImageMongoI,
  Image,
  ImageUploadDto,
  Resize,
  ImageGetAllDto,
  ImageUpdateDto,
  ImageSetFirstImageDto,
  imageGetAllAggregate,
  ImageUploadByUrlDto,
} from '@image';
import fs from 'fs';
import {
  bytesToSize,
  downloadImageFromUrl,
  getValuesForPaginator,
  randomNumber,
} from '@utils';
import { config } from '@config';

export class ImageService {
  async getAll(
    body?: ImageGetAllDto
  ): Promise<{ items: ImageI[]; paginator: PaginatorI } | ImageI[]> {
    try {
      if (body) {
        body.type = body.type ? 'all' : body.type;
        const { pageSize, currentPage, skip } = getValuesForPaginator(body);
        const aggregate = imageGetAllAggregate(body, skip, pageSize);
        const items: ImageI[] = await Image.aggregate(aggregate).exec();
        const total = await Image.find({}).countDocuments().exec();
        const totalPages = Math.ceil(total / pageSize);
        const paginator: PaginatorI = {
          pageSize,
          currentPage,
          totalPages,
          total,
        };
        const itemsWithSize: ImageI[] = [];
        for (const item of items) {
          const imagePath = `${config.paths.uploads}/${item.url}`;
          let size = 0;
          if (fs.existsSync(imagePath)) {
            size = fs.statSync(imagePath).size;
          }
          const i: ImageI = {
            ...item,
            size: size ? bytesToSize(size, 2) : 'N/D',
          };
          itemsWithSize.push(i);
        }

        return { items: itemsWithSize, paginator };
      } else {
        return await Image.find({}).exec();
      }
    } catch (error) {
      return error;
    }
  }

  getOne(id: string): Promise<ImageMongoI> {
    try {
      return Image.findById(id).exec();
    } catch (error) {
      return error;
    }
  }

  upload(data: ImageUploadDto, file: any): Promise<ImageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const rNumber = randomNumber(0, 10000);
        const dataImage = `${data.type}/${data.id}_${rNumber}.png`;
        const imagePath = `${config.paths.uploads}/${dataImage}`;
        const fileUpload = new Resize(imagePath);
        if (!file) {
          reject({ message: 'Falta la imagen' });
        }
        await fileUpload.save(file.buffer);
        const imageCreated: ImageI = await this.create(data, dataImage);
        resolve(imageCreated);
      } catch (error) {
        reject(error);
      }
    });
  }

  uploadByUrl(data: ImageUploadByUrlDto) {
    return new Promise(async (resolve, reject) => {
      try {
        const images = await this.imagesSameTypeId(data);
        data.position = images.length;
        const url = await this.downloadAndUploadImageFromUrl(data);
        if (url) {
          const imageCreated = await this.create(
            {
              type: `${data.type}`,
              id: data.id,
            },
            `${data.type}s/${data.id}_${data.position}.png`
          );
          resolve(imageCreated);
        } else {
          reject({ message: 'La imagen no ha sido añadida' });
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  async create(data: ImageUploadDto, url: string): Promise<ImageMongoI> {
    try {
      let body = {};
      if (
        data.type === 'artist' ||
        data.type === 'site' ||
        data.type === 'media'
      ) {
        body = await this.createForMultiImage(data, url);
      } else {
        body = {
          type: data.type,
          [data.type]: data.id,
          url,
        };
      }
      const imageBody: ImageMongoI = new Image(body);
      const imageCreated = await imageBody.save();
      return imageCreated;
    } catch (error) {
      return error;
    }
  }

  private async createForMultiImage(
    data: ImageUploadDto,
    url: string
  ): Promise<any> {
    let body;
    const imagesSameTypeId = await Image.find({
      type: data.type,
      [data.type]: data.id,
    }).exec();
    if (imagesSameTypeId.length > 0) {
      body = {
        type: data.type,
        [data.type]: data.id,
        url,
        firstImage: false,
        position: imagesSameTypeId.length,
      };
    } else {
      body = {
        type: data.type,
        [data.type]: data.id,
        url,
        firstImage: true,
        position: 0,
      };
    }
    return body;
  }

  update(data: ImageUpdateDto): Promise<ImageMongoI> {
    try {
      return Image.findByIdAndUpdate(data._id, data).exec();
    } catch (error) {
      return error;
    }
  }

  async setFirstImage(data: ImageSetFirstImageDto): Promise<ImageI[]> {
    try {
      let images = await Image.find({ [data.type]: data.typeId })
        .sort({ position: 1 })
        .exec();
      images = images.filter((image) => image._id.toString() !== data.imageId);
      images.forEach(async (image, index) => {
        image.firstImage = false;
        image.position = index + 1;
        await image.save();
      });
      await Image.findByIdAndUpdate(data.imageId, {
        firstImage: true,
        position: 0,
      }).exec();
      return await Image.find({ [data.type]: data.typeId })
        .sort({ position: 1 })
        .exec();
    } catch (error) {
      return error;
    }
  }

  async deleteOne(id: string, force = false): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const item = await this.getOne(id);
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

  async deleteAll(): Promise<MessageI> {
    return new Promise(async (resolve) => {
      const items: any = await Image.find({}).exec();
      for (const item of items) {
        await this.deleteOne(item._id, true);
      }
      if (items.length > 0) {
        resolve({ message: `${items.length} imagenes eliminadas` });
      } else {
        resolve({ message: 'No hay imagenes' });
      }
    });
  }

  private downloadAndUploadImageFromUrl(
    data: ImageUploadByUrlDto
  ): Promise<string> {
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

  private async imagesSameTypeId(data: { type: string; id: string }) {
    return await Image.find({
      type: data.type,
      [data.type]: data.id,
    }).exec();
  }
}
