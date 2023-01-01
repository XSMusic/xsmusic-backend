import { MessageI } from '@interfaces';
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
  ImageHelper,
  ImageResizeAllDto,
} from '@image';
import { getValuesForPaginator } from '@utils';
import { config } from '@config';

export class ImageService {
  private imageHelper = new ImageHelper();
  async getAll(body?: ImageGetAllDto): Promise<ImageI[]> {
    try {
      if (body) {
        body.type = body.type ? 'all' : body.type;
        const { pageSize, skip } = getValuesForPaginator(body);
        const aggregate = imageGetAllAggregate(body, skip, pageSize);
        const items: ImageI[] = await Image.aggregate(aggregate).exec();
        return items;
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
        const images = await this.imagesSameTypeId(data);
        data.position = images.length;
        const filePath = `${config.paths.uploads}/${data.type}s/${data.id}_${data.position}.jpg`;
        const fileUpload = new Resize(filePath);
        if (!file) {
          reject({ message: 'Falta la imagen' });
        }
        await fileUpload.save(file.buffer);
        const imageCreated = await this.create(
          {
            type: `${data.type}`,
            id: data.id,
          },
          `${data.id}_${data.position}.jpg`
        );
        await this.imageHelper.resizeImage(imageCreated._id);
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
        const url = await this.imageHelper.downloadAndUploadImageFromUrl(data);
        if (url) {
          const imageCreated = await this.create(
            {
              type: `${data.type}`,
              id: data.id,
            },
            `${data.id}_${data.position}.jpg`
          );
          await this.imageHelper.resizeImage(imageCreated._id);
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

  resizeAllImages(body: ImageResizeAllDto) {
    return new Promise(async (resolve, reject) => {
      try {
        const images: ImageMongoI[] = await Image.find({
          type: body.type,
        }).exec();
        for (const image of images) {
          await this.imageHelper.resizeImage(image._id);
          const newUrl = image.url.split(`${image.type}s/`)[1];
          if (newUrl.length > 0) {
            image.url = newUrl;
            await image.save();
          }
        }
        resolve({
          message: `Todas las imagenes del tipo ${body.type} han sido redimensionadas`,
        });
      } catch (error) {
        reject({ message: error });
      }
    });
  }

  async deleteOne(id: string, force = false): Promise<MessageI> {
    return this.imageHelper.deleteOne(id, force);
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

  private async imagesSameTypeId(data: { type: string; id: string }) {
    return await Image.find({
      type: data.type,
      [data.type]: data.id,
    }).exec();
  }
}
