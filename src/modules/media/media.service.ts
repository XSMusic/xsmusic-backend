import { Artist } from '@artist';
import { UserTokenI } from '@auth';
import { GetOneDto } from '@dtos';
import { ImageHelper } from '@image';
import { MessageI } from '@interfaces';
import {
  Media,
  mediaGetAllAggregate,
  MediaGetAllDto,
  mediaGetAllForType,
  MediaGetAllForTypeDto,
  mediaGetOneAggregate,
  MediaI,
} from '@media';
import { Site } from '@site';
import { getValuesForPaginator, slugify } from '@utils';
import { inspect } from 'src/shared/services/logger.service';

export class MediaService {
  private imageHelper = new ImageHelper();

  async getAll(body: MediaGetAllDto, user?: UserTokenI): Promise<MediaI[]> {
    try {
      const { pageSize, skip } = getValuesForPaginator(body);
      const aggregate = mediaGetAllAggregate(body, skip, pageSize, user);
      const items = await Media.aggregate(aggregate).exec();
      return items;
    } catch (error) {
      return error;
    }
  }

  async getAllForType(
    body: MediaGetAllForTypeDto,
    user: UserTokenI
  ): Promise<Event[]> {
    try {
      const { pageSize, skip } = getValuesForPaginator(body);
      const aggregate = mediaGetAllForType(body, skip, pageSize, user);
      inspect(aggregate);
      const items = await Media.aggregate(aggregate).exec();
      return items;
    } catch (error) {
      return error;
    }
  }

  getOne(data: GetOneDto, user?: UserTokenI): Promise<MediaI> {
    return new Promise(async (resolve, reject) => {
      try {
        const aggregate = mediaGetOneAggregate(data, user);
        const items = await Media.aggregate(aggregate).exec();
        let item: MediaI;
        if (items.length > 0) {
          item = items[0];
        } else {
          reject({ message: 'El id no existe' });
        }
        resolve(item);
      } catch (error) {
        reject(error);
      }
    });
  }

  create(body: MediaI): Promise<MediaI> {
    return new Promise(async (resolve, reject) => {
      try {
        if (body._id) {
          delete body._id;
        }
        body = await this.setAnonymousSite(body);
        body.slug = await this.generateSlug(body);
        const item = new Media(body);
        const itemDB = await item.save();
        if (itemDB) {
          resolve(itemDB);
        } else {
          reject({ message: `El ${body.type} no ha sido creado` });
        }
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  update(body: MediaI): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        body = await this.setAnonymousSite(body);
        body.slug = await this.generateSlug(body);
        const response = await Media.findByIdAndUpdate(body._id, body, {
          new: true,
        }).exec();
        if (response) {
          resolve({ message: `${body.type} actualizado` });
        } else {
          reject({ message: `El ${body.type} no existe` });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private async setAnonymousSite(body: MediaI) {
    if (body.site === '') {
      const anonymousSite = await Site.findOne({}).exec();
      body.site = anonymousSite._id;
    }
    return body;
  }

  private async generateSlug(body: MediaI) {
    let slug = '';
    for (const artist of body.artists) {
      const artistDB = await Artist.findById(artist).exec();
      if (slug !== '') {
        slug = `${slug}-${slugify(artistDB.name)}`;
      } else {
        slug = slugify(artistDB.name);
      }
    }
    return `${slug}-${slugify(body.name)}-${body.year !== 0 ? body.year : ''}`;
  }

  deleteOne(id: string): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Media.findByIdAndDelete(id).exec();
        if (response) {
          await this.imageHelper.deleteByTypeId({ type: 'media', id });
          resolve({ message: 'Set/track eliminado' });
        } else {
          reject({ message: 'Set/track no existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteAll(): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      const items = await Media.find({}).exec();
      for (const item of items) {
        await this.deleteOne(item._id);
      }
      if (items.length > 0) {
        resolve({ message: `${items.length} sets/tracks eliminados` });
      } else {
        reject({ message: 'No hay sets/tracks' });
      }
    });
  }
}
