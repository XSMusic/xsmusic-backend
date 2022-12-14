import { GetOneDto } from '@dtos';
import { MessageI } from '@interfaces';
import {
  User,
  userGetAllAggregate,
  UserGetAllDto,
  userGetOneAggregate,
  UserI,
} from '@user';
import { getValuesForPaginator } from '@utils';

export class UserService {
  private populateDefault: any = [];

  async getAll(body?: UserGetAllDto): Promise<UserI[]> {
    try {
      const { pageSize, skip } = getValuesForPaginator(body);
      const aggregate = userGetAllAggregate(body, skip, pageSize);
      const items = await User.aggregate(aggregate).exec();
      return items;
    } catch (error) {
      return error;
    }
  }

  getOne(data: GetOneDto): Promise<UserI> {
    return new Promise(async (resolve, reject) => {
      try {
        const aggregate = userGetOneAggregate(data);
        const items = await User.aggregate(aggregate).exec();
        if (items.length > 0) {
          if (items[0].password) {
            items[0].password = undefined;
          }
          resolve(items[0]);
        } else {
          reject({ message: 'El usuario no existe' });
        }
      } catch (error) {
        reject(error);
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
