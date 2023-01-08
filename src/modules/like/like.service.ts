import { GetAllDto, GetOneDto } from '@dtos';
import { MessageI } from '@interfaces';
import { Like, likeGetAllAggregate, likeGetOneAggregate, LikeI } from '@like';
import { getValuesForPaginator } from '@utils';

export class LikeService {
  async getAll(body: GetAllDto): Promise<LikeI[]> {
    try {
      const { pageSize, skip } = getValuesForPaginator(body);
      const aggregate = likeGetAllAggregate(body, skip, pageSize);
      const items = await Like.aggregate(aggregate).exec();
      return items;
    } catch (error) {
      return error;
    }
  }

  getOne(data: GetOneDto): Promise<LikeI> {
    return new Promise(async (resolve, reject) => {
      try {
        const aggregate = likeGetOneAggregate(data);
        const items = await Like.aggregate(aggregate).exec();
        if (items.length > 0) {
          resolve(items[0]);
        } else {
          reject({ message: 'El like no existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  create(body: LikeI): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const data: any = {
          type: body.type,
          user: body.user,
        };
        data[body.type] = body[body.type];
        const isExist: LikeI[] = await Like.find(data).exec();
        if (isExist.length === 0) {
          const item = new Like(body);
          const itemDB = await item.save();
          if (itemDB) {
            resolve({ message: 'Like creado' });
          } else {
            reject({ message: 'El like no ha sido creado' });
          }
        } else {
          await Like.findByIdAndDelete(isExist[0]._id.toString()).exec();
          resolve({ message: 'Like eliminado' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteOne(id: string): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Like.findByIdAndDelete(id).exec();
        if (response) {
          resolve({ message: 'Like eliminado' });
        } else {
          reject({ message: 'Like no existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteAll(): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      const items = await Like.find({}).exec();
      for (const item of items) {
        await this.deleteOne(item._id);
      }
      if (items.length > 0) {
        resolve({ message: `${items.length} likes eliminados` });
      } else {
        reject({ message: 'No hay likes' });
      }
    });
  }
}
