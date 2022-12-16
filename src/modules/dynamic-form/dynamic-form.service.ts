import { artistGetAllAggregate } from '@artist';
import { GetAllDto } from '@dtos';
import {
  DynamicForm,
  DynamicFormCreateItemDto,
  dynamicFormGetAllAggregate,
  dynamicFormGetOneAggregate,
  DynamicFormI,
  DynamicFormItem,
  DynamicFormItemI,
  DynamicFormMongoI,
} from '@dynamicForm';
import { MessageI, PaginatorI } from '@interfaces';
import { getValuesForPaginator } from '@utils';

export class DynamicFormService {
  async getAll(body: GetAllDto): Promise<any> {
    try {
      let items;
      let total = 0;
      const { pageSize, currentPage, skip } = getValuesForPaginator(body);
      if (body.type === 'form') {
        const aggregate = dynamicFormGetAllAggregate(body, skip, pageSize);
        items = await DynamicForm.aggregate(aggregate).exec();
        total = await DynamicForm.find({}).countDocuments().exec();
      } else {
        const aggregate = artistGetAllAggregate(body, skip, pageSize);
        items = await DynamicFormItem.aggregate(aggregate).exec();
        total = await DynamicFormItem.find({}).countDocuments().exec();
      }
      const totalPages = Math.ceil(total / pageSize);
      const paginator: PaginatorI = {
        pageSize,
        currentPage,
        totalPages,
        total,
      };
      return { items, paginator };
    } catch (error) {
      return error;
    }
  }

  async getOne(type: string, id: string) {
    return new Promise(async (resolve, reject) => {
      try {
        let item;
        if (type === 'form') {
          const aggregate = dynamicFormGetOneAggregate(id);
          item = await DynamicForm.aggregate(aggregate).exec();
        } else {
          item = await DynamicFormItem.findById(id).exec();
        }
        if (item) {
          resolve(item);
        } else {
          reject({ message: `El ${type} no existe` });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  createForm(body: DynamicFormCreateItemDto): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const isExist: DynamicFormMongoI[] = await DynamicForm.find({
          name: body.name,
        }).exec();
        if (isExist.length === 0) {
          const item = new DynamicForm(body);
          const itemDB = await item.save();
          if (itemDB) {
            resolve({ message: 'Formulario creado' });
          } else {
            reject({ message: 'Formulario no creado' });
          }
        } else {
          reject({ message: 'Formulario ya existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  createFormItem(body: DynamicFormCreateItemDto): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const item = new DynamicFormItem(body);
        const itemDB = await item.save();
        if (itemDB) {
          resolve({ message: 'Item de formulario creado' });
        } else {
          reject({ message: 'Item de formulario no creado' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  updateForm(body: DynamicFormI): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await DynamicForm.findByIdAndUpdate(body._id, body, {
          new: true,
        }).exec();
        if (response) {
          resolve({ message: 'Formulario actualizado' });
        } else {
          reject({ message: 'Formulario no existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  updateFormItem(body: DynamicFormItemI): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await DynamicFormItem.findByIdAndUpdate(
          body._id,
          body,
          {
            new: true,
          }
        ).exec();
        if (response) {
          resolve({ message: 'Item de Formulario actualizado' });
        } else {
          reject({ message: 'Item de Formulario no existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteOne(type: string, id: string): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        let response;
        if (type === 'form') {
          response = await DynamicForm.findByIdAndDelete(id).exec();
        } else {
          response = await DynamicFormItem.findByIdAndDelete(id).exec();
        }
        if (response) {
          resolve({
            message: `${
              type === 'form' ? 'Formulario' : 'Item de formulario'
            } eliminado`,
          });
        } else {
          reject({
            message: `${
              type === 'form' ? 'Formulario' : 'Item de formulario'
            } no existe`,
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
