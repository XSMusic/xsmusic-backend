import {
  Artist,
  artistGetAllAggregate,
  ArtistI,
  artistGetOneAggregate,
} from '@artist';
import { GetAllDto, GetOneDto } from '@dtos';
import { ImageHelper } from '@image';
import { MessageI } from '@interfaces';
import { getValuesForPaginator, slugify } from '@utils';
import { Logger } from 'src/shared/services/logger.service';
import { UserTokenI } from '../auth/auth.interface';

export class ArtistService {
  private imageHelper = new ImageHelper();

  async getAll(body: GetAllDto, user?: UserTokenI): Promise<ArtistI[]> {
    return new Promise<ArtistI[]>(async (resolve, reject) => {
      try {
        const { pageSize, skip } = getValuesForPaginator(body);
        const aggregate = artistGetAllAggregate(body, skip, pageSize, user);
        const items = await Artist.aggregate(aggregate).exec();
        resolve(items);
      } catch (error) {
        Logger.error(error);
        reject(error);
      }
    });
  }

  getOne(data: GetOneDto, user?: UserTokenI): Promise<ArtistI> {
    return new Promise(async (resolve, reject) => {
      try {
        const aggregate = artistGetOneAggregate(data, user);
        const items = await Artist.aggregate(aggregate).exec();
        if (items.length > 0) {
          resolve(items[0]);
        } else {
          reject({ message: 'El artista no existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  create(body: ArtistI): Promise<ArtistI> {
    return new Promise(async (resolve, reject) => {
      try {
        const isExist: ArtistI[] = await Artist.find({
          name: body.name,
        }).exec();
        if (isExist.length === 0) {
          if (body._id) {
            delete body._id;
          }
          body.slug = slugify(body.name);
          const item = new Artist(body);
          const itemDB = await item.save();
          if (itemDB) {
            resolve(itemDB);
          } else {
            reject({ message: 'El artista no ha sido creado' });
          }
        } else {
          reject({ message: 'El artista ya existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  update(body: ArtistI): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        body.slug = slugify(body.name);
        const response = await Artist.findByIdAndUpdate(body._id, body, {
          new: true,
        }).exec();
        if (response) {
          resolve({ message: 'Artista actualizado' });
        } else {
          reject({ message: 'Artista no existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteOne(id: string): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        // TODO: Eliminar media del artista
        const response = await Artist.findByIdAndDelete(id).exec();
        if (response) {
          await this.imageHelper.deleteByTypeId({ type: 'artist', id });
          resolve({ message: 'Artista eliminado' });
        } else {
          reject({ message: 'Artista no existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteAll(): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      const items = await Artist.find({}).exec();
      for (const item of items) {
        await this.deleteOne(item._id);
      }
      if (items.length > 0) {
        resolve({ message: `${items.length} artistas eliminados` });
      } else {
        reject({ message: 'No hay artistas' });
      }
    });
  }
}
