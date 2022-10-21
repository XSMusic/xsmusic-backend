import { GetAllDto, IdDto } from '@dtos';
import { MessageI, PaginatorI } from '@interfaces';
import { getValuesForPaginator } from '@utils';
import { Style, StyleGetAllAggregate, StyleI } from '@style';

export class StyleService {
  getAll(body: GetAllDto): Promise<{ items: StyleI[]; paginator: PaginatorI }> {
    return new Promise(async (resolve, reject) => {
      try {
        const { pageSize, currentPage, skip } = getValuesForPaginator(body);
        const aggregate = StyleGetAllAggregate(body, skip, pageSize);
        const items = await Style.aggregate(aggregate).exec();
        const total = await Style.find({}).countDocuments().exec();
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

  getOneById(body: IdDto): Promise<StyleI> {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await Style.findById(body.id).exec());
      } catch (error) {
        reject(error);
      }
    });
  }

  create(body: StyleI): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const isExist: StyleI[] = await Style.find({
          name: body.name,
        }).exec();
        if (isExist.length === 0) {
          const item = new Style(body);
          item.save();
          resolve({ message: 'Estilo creado' });
        } else {
          reject({ message: 'El estilo ya existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  update(body: StyleI): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Style.findByIdAndUpdate(body._id, body, {
          new: true,
        }).exec();
        if (response) {
          resolve({ message: 'Estilo actualizado' });
        } else {
          reject({ message: 'Estilo no existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteOne(id: string): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Style.findByIdAndDelete(id).exec();
        if (response) {
          resolve({ message: 'Estilo eliminado' });
        } else {
          reject({ message: 'Estilo no existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteAll(): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      const items = await Style.find({}).exec();
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
