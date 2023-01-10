import { ImageHelper } from '@image';
import { MessageI } from '@interfaces';
import {
  Event,
  eventGetAllAggregate,
  eventGetAllForType,
  EventGetAllForTypeDto,
  eventGetOneAggregate,
  EventI,
} from '@event';
import { getValuesForPaginator, slugify } from '@utils';
import moment from 'moment';
import { Site } from '@site';
import { GetAllDto, GetOneDto } from '@dtos';
import { UserTokenI } from '@auth';

export class EventService {
  private imageHelper = new ImageHelper();
  getAll(body: GetAllDto, user?: UserTokenI): Promise<Event[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const { pageSize, skip } = getValuesForPaginator(body);
        const aggregate = eventGetAllAggregate(body, skip, pageSize, user);
        const items = await Event.aggregate(aggregate).exec();
        resolve(items);
      } catch (error) {
        reject(error);
      }
    });
  }

  getAllForType(
    body: EventGetAllForTypeDto,
    user: UserTokenI
  ): Promise<Event[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const { pageSize, skip } = getValuesForPaginator(body);
        const aggregate = eventGetAllForType(body, skip, pageSize, user);
        const items = await Event.aggregate(aggregate).exec();
        resolve(items);
      } catch (error) {
        reject(error);
      }
    });
  }

  getOne(body: GetOneDto, user?: UserTokenI): Promise<EventI> {
    return new Promise(async (resolve, reject) => {
      try {
        const aggregate = eventGetOneAggregate(body, user);
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
          date: body.date,
        }).exec();
        if (isExist.length === 0) {
          if (body._id) {
            delete body._id;
          }
          body.slug = await this.slugifyEvent(body);
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
          body.slug = await this.slugifyEvent(body);
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

  private async slugifyEvent(event: EventI): Promise<string> {
    try {
      if (typeof event.site === 'string') {
        const site = await Site.findById(event.site.toString()).exec();
        if (site) {
          event.site = site;
        }
      }
      return slugify(
        `${event.name}-${
          event.site && event.site.name! ? event.site.name : ''
        }-${moment(event.date).format('DD-MM-YY')}`
      );
    } catch (error) {
      return error;
    }
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
