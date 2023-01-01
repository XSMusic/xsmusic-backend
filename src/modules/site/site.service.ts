import {
  Site,
  siteGetAllAggregate,
  SiteI,
  siteGetOneAggregate,
} from 'src/modules/site';
import { MessageI } from '@interfaces';
import { getValuesForPaginator, slugify } from '@utils';
import { ImageHelper } from '@image';
import { GetAllDto, GetOneDto } from '@dtos';

export class SiteService {
  private imageHelper = new ImageHelper();

  getAll(body: GetAllDto): Promise<SiteI[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const { pageSize, skip } = getValuesForPaginator(body);
        const aggregate = siteGetAllAggregate(body, true, skip, pageSize);
        const items = await Site.aggregate(aggregate).exec();
        resolve(items);
      } catch (error) {
        reject(error);
      }
    });
  }

  getOne(body: GetOneDto): Promise<SiteI> {
    return new Promise(async (resolve, reject) => {
      try {
        const aggregate = siteGetOneAggregate(body);
        const items = await Site.aggregate(aggregate).exec();
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

  create(body: SiteI): Promise<SiteI> {
    return new Promise(async (resolve, reject) => {
      try {
        const type = body.type === 'club' ? 'Club' : 'Festival';
        const isExist: SiteI[] = await Site.find({
          name: body.name,
        }).exec();
        if (isExist.length === 0) {
          if (body._id) {
            delete body._id;
          }
          body.slug = slugify(body.name);
          const item = new Site(body);
          const itemDB = await item.save();
          if (itemDB) {
            resolve(itemDB);
          } else {
            reject({
              message: `El ${type} no ha sido actualizado`,
            });
          }
        } else {
          reject({
            message: `El ${type} ya existe`,
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  update(body: SiteI): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        body.slug = slugify(body.name);
        const response = await Site.findByIdAndUpdate(body._id, body, {
          new: true,
        }).exec();
        if (response) {
          resolve({
            message: `${
              body.type === 'club' ? 'Club' : 'Festival'
            } actualizado`,
          });
        } else {
          reject({
            message: `${body.type === 'club' ? 'Club' : 'Festival'} no existe`,
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteOne(id: string): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Site.findByIdAndDelete(id).exec();
        if (response) {
          await this.imageHelper.deleteByTypeId({ type: 'site', id });
          resolve({ message: 'Sitio eliminado' });
        } else {
          reject({ message: 'Sitio no existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteAll(): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      const items = await Site.find({}).exec();
      for (const item of items) {
        await this.deleteOne(item._id);
      }
      if (items.length > 0) {
        resolve({ message: `${items.length} sitios eliminados` });
      } else {
        reject({ message: 'No hay sitios' });
      }
    });
  }
}
