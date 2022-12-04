import { ImageHelper } from '@image';
import { MessageI, PaginatorI } from '@interfaces';
import {
  Event,
  eventGetAllAggregate,
  EventGetAllDto,
  eventGetOneAggregate,
  EventI,
} from '@event';
import { getValuesForPaginator, slugify } from '@utils';
import moment from 'moment';

export class EventService {
  private imageHelper = new ImageHelper();
  getAll(
    body: EventGetAllDto
  ): Promise<{ items: Event[]; paginator: PaginatorI }> {
    return new Promise(async (resolve, reject) => {
      try {
        const { pageSize, currentPage, skip } = getValuesForPaginator(body);
        const aggregate = eventGetAllAggregate(body, true, skip, pageSize);
        const items = await Event.aggregate(aggregate).exec();
        const aggregateTotal = eventGetAllAggregate(body, false);
        const total = (await Event.aggregate(aggregateTotal).exec()).length;
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

  getOne(type: 'id' | 'slug', value: string): Promise<EventI> {
    return new Promise(async (resolve, reject) => {
      try {
        const aggregate = eventGetOneAggregate(type, value);
        const items = await Event.aggregate(aggregate).exec();
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

  create(body: EventI): Promise<EventI> {
    return new Promise(async (resolve, reject) => {
      try {
        const isExist: EventI[] = await Event.find({
          name: body.name,
        }).exec();
        if (isExist.length === 0) {
          if (body._id) {
            delete body._id;
          }
          body.slug = this.slugifyEvent(body);
          const item = new Event(body);
          const itemDB = await item.save();
          if (itemDB) {
            resolve(itemDB);
          } else {
            reject({ message: 'El evento no ha sido creado' });
          }
        } else {
          reject({ message: 'El evento ya existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  update(body: EventI): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        if (body.name) {
          body.slug = this.slugifyEvent(body);
        }
        const response = await Event.findByIdAndUpdate(body._id, body, {
          new: true,
        }).exec();
        if (response) {
          resolve({ message: 'Evento actualizado' });
        } else {
          reject({ message: 'Evento no existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private slugifyEvent(event: EventI): string {
    return slugify(
      `${event.name}-${event.site.name!}-${moment(event.date).format(
        'DD-MM-YY'
      )}`
    );
  }

  deleteOne(id: string): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await Event.findByIdAndDelete(id).exec();
        if (response) {
          await this.imageHelper.deleteByTypeId({ type: 'event', id });
          resolve({ message: 'Evento eliminado' });
        } else {
          reject({ message: 'Evento no existe' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteAll(): Promise<MessageI> {
    return new Promise(async (resolve, reject) => {
      const items = await Event.find({}).exec();
      for (const item of items) {
        await this.deleteOne(item._id);
      }
      if (items.length > 0) {
        resolve({ message: `${items.length} eventos eliminados` });
      } else {
        reject({ message: 'No hay eventos' });
      }
    });
  }
}
