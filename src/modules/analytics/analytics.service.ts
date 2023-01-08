import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from '@google-analytics/data/build/protos/protos';
import { AnalyticsGetGenericDto } from './analytics.dto';
import {
  AnalyticsGetEventsWithCategoriesResponse,
  AnalyticsGetVisitsResponse,
} from './analytics.response';
import { format } from 'date-fns/fp';
import { countriesCodes } from './countries.enum';
import { config } from '@config';

export class AnalyticsService {
  analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: config.paths.googleApplicationCredentials,
  });

  property = 'properties/338535534';
  dimensions = ['city', 'country', 'eventName'];
  metrics = [
    'activeUsers',
    'newUsers',
    'totalRevenue',
    'eventCountPerUser',
    'screenPageViewsPerSession',
  ];

  getDataForVMap(data: AnalyticsGetGenericDto): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const countries: any[] = [];
        const [response] = await this.analyticsDataClient.runReport({
          property: this.property,
          dateRanges: [{ startDate: data.startDate, endDate: data.endDate }],
          dimensions: [{ name: 'country' }],
          metrics: [{ name: 'activeUsers' }],
        });
        response.rows.forEach((row) => {
          const countryRowName: string = row.dimensionValues[0].value.trim();
          if (countryRowName !== '(not set)') {
            const countryName = countryRowName.replace(/\s/g, '');
            const country = countriesCodes[countryName].toLowerCase();
            countries.push([country, Number(row.metricValues[0].value)]);
          }
        });

        resolve(countries);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getVisits(
    data: AnalyticsGetGenericDto
  ): Promise<AnalyticsGetVisitsResponse[]> {
    const options: any = {
      property: this.property,
      dateRanges: [{ startDate: data.startDate, endDate: data.endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'eventCountPerUser' },
        { name: 'newUsers' },
        { name: 'screenPageViewsPerSession' },
      ],
    };
    if (data.order) {
      options['orderBys'] = [{ dimension: { dimensionName: data.order } }];
    }
    const [response] = await this.analyticsDataClient.runReport(options);
    const items: any[] = [];
    response.rows.forEach((row) => {
      items.push({
        date: this.fixedDateForAnalytics(row.dimensionValues[0].value),
        items: [
          {
            name: 'Visitas',
            value: this.fixedNumber(row.metricValues[0].value),
          },
          {
            name: 'Eventos',
            value: this.fixedNumber(row.metricValues[1].value),
          },
          {
            name: 'Nuevos',
            value: this.fixedNumber(row.metricValues[2].value),
          },
          {
            name: 'Paginas',
            value: this.fixedNumber(row.metricValues[3].value),
          },
        ],
      });
    });
    return items;
  }

  async getVisitsRealTime(): Promise<any[]> {
    const options: any = {
      property: this.property,
      dimensions: [{ name: 'minutesAgo' }],
      metrics: [{ name: 'activeUsers' }],
    };
    const [response] = await this.analyticsDataClient.runRealtimeReport(
      options
    );
    const items: any[] = [];
    response.rows.forEach((row) => {
      items.push({
        date: row.dimensionValues[0].value,
        value: Number(row.metricValues[0].value),
      });
    });
    return items;
  }

  async getEventsWithCategories(
    data: AnalyticsGetGenericDto
  ): Promise<AnalyticsGetEventsWithCategoriesResponse[]> {
    let items: any[] = [];
    const categories = [
      'car',
      'cars',
      'tournament',
      'tournaments',
      'dashboard',
      'myData',
      'myGarage',
      'myGarageOne',
      'myGarageImages',
      'myInscriptions',
      'myTrophies',
      'ranking',
      'notification',
      'tabs',
      'auth',
      'app',
    ];
    for (const item of categories) {
      items.push({ name: item, items: [] });
    }
    items.push({ name: 'others', items: [] });

    const [response] = await this.analyticsDataClient.runReport({
      property: this.property,
      dateRanges: [{ startDate: data.startDate, endDate: data.endDate }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
    });
    items = this.setItemsForGetEvents(response, categories, items);
    return items;
  }

  private setItemsForGetEvents(
    response: google.analytics.data.v1beta.IRunReportResponse,
    categories: string[],
    items: any[]
  ): AnalyticsGetEventsWithCategoriesResponse[] {
    response.rows.forEach((row: any) => {
      const name = row.dimensionValues[0].value;
      const value = Number(row.metricValues[0].value);

      const type = name.split('_')[0];
      if (this.checkItemIsInCategory(type, categories)) {
        this.addItemToArray(type, name, value, items);
      } else {
        if (
          name === 'page_view' ||
          name === 'session_start' ||
          name === 'first_visit' ||
          name === 'screen_view' ||
          name === 'first_open'
        ) {
          const index = items.findIndex((item: any) => item.name === 'app');
          items[index].items.push({
            name: name,
            value,
          });
        } else {
          const index = items.findIndex((item: any) => item.name === 'others');
          items[index].items.push({
            name: name,
            value,
          });
        }
      }
    });

    items = this.setTotals(items);
    return items;
  }

  private checkItemIsInCategory(item: string, category: string[]): boolean {
    return category.includes(item);
  }

  private addItemToArray(
    type: string,
    name: string,
    value: number,
    items: AnalyticsGetEventsWithCategoriesResponse[]
  ): any[] {
    return items.map((item: AnalyticsGetEventsWithCategoriesResponse) => {
      if (item.name === type) {
        const type2 = name.split('_')[0];
        const nameWithoutType = name.split(type2 + '_')[1];
        item.items.push({
          name: nameWithoutType,
          value,
        });
      }
    });
  }

  private setTotals(items: AnalyticsGetEventsWithCategoriesResponse[]) {
    return items.map((item: AnalyticsGetEventsWithCategoriesResponse) => {
      const total = item.items.reduce((acc, cur) => acc + cur.value, 0);
      item.total = total;
      return item;
    });
  }

  private fixedNumber(value: string): number {
    return Number(Number(value).toFixed(0));
  }

  private fixedDateForAnalytics(value: string) {
    return format(
      'dd-MM',
      new Date(
        Number(value.substring(0, 4)),
        Number(value.substring(4, 6)) - 1,
        Number(value.substring(6, 8))
      )
    );
  }
}
