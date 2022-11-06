import { MessageI, PaginatorI } from '@interfaces';
import {
  Media,
  mediaGetAllAggregate,
  MediaGetAllDto,
  mediaGetOneAggregate,
  MediaI,
} from '@media';
import { getValuesForPaginator } from '@utils';

export class MediaService {
  getAll(
    body: MediaGetAllDto
  ): Promise<{ items: MediaI[]; paginator: PaginatorI }> {
    return new Promise(async (resolve, reject) => {
      try {
        const { pageSize, currentPage, skip } = getValuesForPaginator(body);
        const aggregate = mediaGetAllAggregate(body, skip, pageSize);
        const items = await Media.aggregate(aggregate).exec();
        const total = await Media.find({}).countDocuments().exec();
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

  getOne(body: { id?: string; slug?: string }): Promise<MediaI> {
    return new Promise(async (resolve, reject) => {
      try {
        const type = body.id ? '_id' : 'slug';
        const value = body.id ? body.id : body.slug;
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

  create(body: MediaI): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        if (body._id) {
          delete body._id;
        }
        const item = new Media(body);
        const itemDB = await item.save();
        if (itemDB) {
          resolve({ message: `${body.type} creado` });
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

  deleteOne(id: string): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Media.findByIdAndDelete(id).exec();
        if (response) {
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
