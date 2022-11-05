import { MessageI, PaginatorI } from '@interfaces';
import { User, userGetAllAggregate, UserGetAllDto, UserI } from '@user';
import { getValuesForPaginator } from '@utils';

export class UserService {
  private populateDefault: any = [];

  async getAll(
    body?: UserGetAllDto
  ): Promise<{ items: UserI[]; paginator: PaginatorI } | UserI[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const { pageSize, currentPage, skip } = getValuesForPaginator(body);
        const aggregate = userGetAllAggregate(body, skip, pageSize);
        const items = await User.aggregate(aggregate).exec();
        const total = await User.find({}).countDocuments().exec();
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

  getOne(id: string): Promise<UserI> {
    return new Promise(async (resolve, reject) => {
      try {
        const item = await User.findById(id).exec();
        if (item.password) {
          item.password = undefined;
        }
        resolve(item);
      } catch (error) {
        reject({ message: 'Error al obtener el usuario' });
      }
    });
  }

  create(body: UserI): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const isExist: UserI[] = await User.find({
          name: body.name,
        }).exec();
        if (isExist.length === 0) {
          if (body._id) {
            delete body._id;
          }
          const item = new User(body);
          const itemDB = await item.save();
          if (itemDB) {
            resolve({ message: 'Usuario creado' });
          } else {
            reject({ message: 'El usuario no ha sido creado' });
          }
        } else {
          reject({ message: 'El usuario ya existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  update(body: UserI): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await User.findByIdAndUpdate(body._id, body, {
          new: true,
        }).exec();
        if (response) {
          resolve({ message: 'Usuario actualizado' });
        } else {
          reject({ message: 'Usuario no existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteOne(id: string): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await User.findByIdAndDelete(id).exec();
        if (response) {
          resolve({ message: 'Usuario eliminado' });
        } else {
          reject({ message: 'Usuario no existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteAllFake(): Promise<MessageI> {
    try {
      const users = await this.getAll();
      if (users instanceof Array) {
        const fakeUsers = users.filter((user) => user.role === 'FAKE');
        for (const user of fakeUsers) {
          await this.deleteOne(user._id);
        }
        return {
          message: `${fakeUsers.length} usuarios falsos eliminados`,
        };
      }
    } catch (error) {
      return error;
    }
  }
}
