import { EventI } from '@event';
import {
  ScrapingEventI,
  ScrapingEventRaI,
  ScrapingEventRaVenueI,
  ScrapingEventsI,
  ScrapingGetListEventsDto,
} from '@scraping';
import { Site, SiteI, SiteService } from '@site';
import { capitalize } from '@utils';
import axios from 'axios';
import moment from 'moment';
import { Event } from '../event/event.model';
import { ScrapingDiscarts } from './scraping-discarts.model';

export class ScrapingEventService {
  private siteService = new SiteService();

  getEventsListRA(data: ScrapingGetListEventsDto): Promise<ScrapingEventsI> {
    return new Promise(async (resolve, reject) => {
      try {
        const url = 'https://ra.co/graphql';
        const body = {
          operationName: 'GET_POPULAR_EVENTS',
          variables: {
            count: Number(data.maxResults),
            areaId: data.area ?? '41',
            dateFrom: data.dateFrom,
            dateTo: data.dateTo,
          },
          query:
            'query GET_POPULAR_EVENTS($count: Int!, $areaId: ID, $dateFrom: DateTime, $dateTo: DateTime) {\n  events(limit: $count, type: POPULAR, areaId: $areaId, dateFrom: $dateFrom, dateTo: $dateTo) {\n    ...eventFields\n }\n}\n\nfragment eventFields on Event {\n  title\n  date\n  content\n images {\n  filename\n  }\n  venue {\n name\n  id\n  contentUrl\n  }\n }\n',
        };
        const response = await axios.post<any>(url, body);
        const responseEvents: ScrapingEventRaI[] = response.data.data.events;
        const items: ScrapingEventsI = {
          completed: [],
          notCompleted: [],
        };
        const responseSites = await this.siteService.getAll({
          page: 1,
          pageSize: 10000,
          type: 'all',
          map: false,
        });

        const sites = responseSites.items;
        for (const item of responseEvents) {
          if (!item.venue.name.includes('TBA')) {
            const date = moment(item.date).format('YYYY-MM-DD HH:mm');
            const site = await this.getClub(item.venue, sites);
            const i: ScrapingEventI = {
              name: capitalize(item.title, true),
              date,
              info: item.content ?? '',
              images: item.images.map((item) => item.filename),
              site,
            };
            if (i.images.length > 0) {
              await this.setCompletedAndNot(i, items);
            }
          }
        }
        resolve(items);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  getEventsBySiteId(id: string): Promise<ScrapingEventI[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const events: ScrapingEventI[] = [];
        const site: SiteI = await this.siteService.getOne({
          type: 'id',
          value: id,
        });
        if (site.social && site.social.ra && site.social.ra !== '') {
          const url = 'https://ra.co/graphql';
          const body = {
            operationName: 'GET_VENUE_MOREON',
            variables: {
              id: Number(site.social.ra),
            },
            query:
              'query GET_VENUE_MOREON($id: ID!, $excludeEventId: ID = 0) {\n  venue(id: $id) {\n    id\n    name\n          events(limit: 8, type: LATEST, excludeIds: [$excludeEventId]) {\n  title\n   date\n content\n images {\n  filename\n  }\n  }\n  }\n}\n',
          };
          const response = await axios.post<any>(url, body);
          for (const item of response.data.data.venue.events) {
            site.images = [site.images[0]];
            const date = moment(item.date).format('YYYY-MM-DD HH:mm');
            const data = {
              name: item.title,
              date,
              images: item.images.map((image: any) => image.filename),
              site,
              info: item.content ?? '',
            };
            const noExistItem = await this.filterEventsInDB(data);
            if (noExistItem) {
              events.push(data);
            }
          }
          resolve(events);
        } else {
          reject({ message: 'No existe id de ra' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private async setCompletedAndNot(i: ScrapingEventI, items: ScrapingEventsI) {
    if (i.site && i.site.name) {
      const eventNoExistInDB = await this.filterEventsInDB(i);
      if (eventNoExistInDB) {
        items.completed.push(i);
      }
    } else {
      items.notCompleted.push(i);
    }
  }

  private async filterEventsInDB(i: ScrapingEventI): Promise<ScrapingEventI> {
    const events: EventI[] = await Event.find({}).exec();
    const discarts: string[] = (
      await ScrapingDiscarts.find({ source: 'event' }).exec()
    ).map((item) => item.value);
    if (
      !events.find(
        (e) => e.site.toString() === i.site._id!.toString() && e.date === i.date
      ) &&
      !discarts.includes(`${i.site._id!.toString()} ${i.date}`)
    ) {
      return i;
    }
  }

  private async getClub(
    venue: ScrapingEventRaVenueI,
    sites: SiteI[]
  ): Promise<SiteI | string> {
    try {
      const site = sites.find(
        (site) => site.name.toLowerCase() === venue.name.toLowerCase()
      );
      if (site) {
        const siteDB = await Site.findById(site._id.toString());
        if (!siteDB.social.ra || siteDB.social.ra === '') {
          siteDB.social.ra = venue.id;
          await siteDB.save();
        }
        return site;
      } else {
        return venue.name;
      }
    } catch (error) {
      return error;
    }
  }
}
