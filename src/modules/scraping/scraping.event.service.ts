import { EventI } from '@event';
import {
  ScrapingEventI,
  ScrapingEventRaI,
  ScrapingEventsI,
  ScrapingGetListEventsDto,
} from '@scraping';
import { SiteI, SiteService } from '@site';
import axios from 'axios';
import moment from 'moment';
import { Event } from '../event/event.model';

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
            'query GET_POPULAR_EVENTS($count: Int!, $areaId: ID, $dateFrom: DateTime, $dateTo: DateTime) {\n  events(limit: $count, type: POPULAR, areaId: $areaId, dateFrom: $dateFrom, dateTo: $dateTo) {\n    ...eventFields\n }\n}\n\nfragment eventFields on Event {\n  title\n  date\n  content\n images {\n  filename\n  }\n  venue {\n name\n    contentUrl\n  }\n }\n',
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
        const events: EventI[] = await Event.find({}).exec();
        for (const item of responseEvents) {
          if (!item.venue.name.includes('TBA')) {
            const date = moment(item.date).format('YYYY-MM-DD HH:mm');
            const site = this.getClub(item.venue.name, sites);

            const i: ScrapingEventI = {
              name: item.title,
              date,
              info: item.content,
              images: item.images.map((item) => item.filename),
              site,
            };

            this.setCompletedAndNot(i, events, items);
          }
        }
        resolve(items);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  private setCompletedAndNot(
    i: ScrapingEventI,
    events: EventI[],
    items: ScrapingEventsI
  ) {
    if (i.site && i.site.name) {
      if (
        !events.find(
          (e) =>
            e.site.toString() === i.site._id!.toString() && e.date === i.date
        )
      ) {
        items.completed.push(i);
      }
    } else {
      items.notCompleted.push(i);
    }
  }

  private getClub(name: string, sites: SiteI[]) {
    const site = sites.find(
      (site) => site.name.toLowerCase() === name.toLowerCase()
    );
    if (site) {
      return site;
    } else {
      return name;
    }
  }
}
