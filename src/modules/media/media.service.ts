import { Artist } from '@artist';
import { ImageHelper } from '@image';
import { MessageI, PaginatorI } from '@interfaces';
import {
  Media,
  mediaGetAllAggregate,
  MediaGetAllDto,
  mediaGetOneAggregate,
  MediaI,
} from '@media';
import { Site } from '@site';
import { getValuesForPaginator, slugify } from '@utils';

export class MediaService {
  private imageHelper = new ImageHelper();

  getAll(
    body: MediaGetAllDto
  ): Promise<{ items: MediaI[]; paginator: PaginatorI }> {
    return new Promise(async (resolve, reject) => {
      try {
        const { pageSize, currentPage, skip } = getValuesForPaginator(body);
        const aggregate = mediaGetAllAggregate(body, skip, pageSize);
        const items = await Media.aggregate(aggregate).exec();
        const total = await Media.find({ type: body.type })
          .countDocuments()
          .exec();
        const totalPages = Math.ceil(total / pageSize);
        const paginator: PaginatorI = {
          pageSize,
          currentPage,
          totalPages,
          total,
        };
        resolve({ items, paginator });
      } catch (error) {
        reject(error);
      }
    });
  }

  getOne(type: 'id' | 'slug', value: string): Promise<MediaI> {
    return new Promise(async (resolve, reject) => {
      try {
        const aggregate = mediaGetOneAggregate(type, value);
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
