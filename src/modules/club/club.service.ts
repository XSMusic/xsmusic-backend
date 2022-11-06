import {
  Club,
  clubGetAllAggregate,
  ClubGetAllDto,
  ClubI,
  clubGetOneAggregate,
} from '@club';
import { MessageI, PaginatorI } from '@interfaces';
import { getValuesForPaginator, slugify } from '@utils';

export class ClubService {
  getAll(
    body: ClubGetAllDto
  ): Promise<{ items: ClubI[]; paginator: PaginatorI }> {
    return new Promise(async (resolve, reject) => {
      try {
        const { pageSize, currentPage, skip } = getValuesForPaginator(body);
        const aggregate = clubGetAllAggregate(body, skip, pageSize);
        const items = await Club.aggregate(aggregate).exec();
        const total = await Club.find({}).countDocuments().exec();
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

  getOne(body: { id?: string; slug?: string }): Promise<ClubI> {
    return new Promise(async (resolve, reject) => {
      try {
        const type = body.id ? '_id' : 'slug';
        const value = body.id ? body.id : body.slug;
        const aggregate = clubGetOneAggregate(type, value);
        const items = await Club.aggregate(aggregate).exec();
        if (items.length > 0) {
          resolve(items[0]);
        } else {
          reject({ message: 'El id no existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  create(body: ClubI): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const isExist: ClubI[] = await Club.find({
          name: body.name,
        }).exec();
        if (isExist.length === 0) {
          if (body._id) {
            delete body._id;
          }
          body.slug = slugify(body.name);
          const item = new Club(body);
          const itemDB = await item.save();
          if (itemDB) {
            resolve({ message: 'Club creado' });
          } else {
            reject({ message: 'El club no ha sido creado' });
          }
        } else {
          reject({ message: 'El club ya existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  update(body: ClubI): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        body.slug = slugify(body.name);
        const response = await Club.findByIdAndUpdate(body._id, body, {
          new: true,
        }).exec();
        if (response) {
          resolve({ message: 'Club actualizado' });
        } else {
          reject({ message: 'Club no existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteOne(id: string): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Club.findByIdAndDelete(id).exec();
        if (response) {
          resolve({ message: 'Club eliminado' });
        } else {
          reject({ message: 'Club no existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteAll(): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      const items = await Club.find({}).exec();
      for (const item of items) {
        await this.deleteOne(item._id);
      }
      if (items.length > 0) {
        resolve({ message: `${items.length} clubs eliminados` });
      } else {
        reject({ message: 'No hay clubs' });
      }
    });
  }
}
