import { Artist } from '@artist';
import { Style, StyleMongoI } from '@style';
import { Model } from 'mongoose';
import { StatsTotalsAdminI } from './stats.interface';
import { ArtistMongoI } from '../artist/artist.interface';
import { Media } from '@media';
import { StatsGetTopArtistsDto } from '@stats';
import { countries, sortByTotal } from '@utils';

export class StatsService {
  getForAdmin(): Promise<StatsTotalsAdminI> {
    return new Promise(async (resolve, reject) => {
      try {
        const totals: StatsTotalsAdminI = {
          artists: await this.setTotal<ArtistMongoI>(Artist),
          styles: await this.setTotal<StyleMongoI>(Style),
          sets: await this.setTotal<StyleMongoI>(Media, 'set'),
          tracks: await this.setTotal<StyleMongoI>(Media, 'track'),
          clubs: 0,
          events: 0,
        };
        resolve(totals);
      } catch (error) {
        reject(error);
      }
    });
  }

  private setTotal<T>(model: Model<T>, type?: string) {
    const body = type ? { type } : {};
    return model.countDocuments(body).exec();
  }

  getTopArtists(body: StatsGetTopArtistsDto) {
    return new Promise(async (resolve, reject) => {
      try {
        const artists = await Artist.find({}).exec();
        let data: any[] = [];
        data = this.typeIsCountry(body, artists, data);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  }

  private typeIsCountry(
    body: StatsGetTopArtistsDto,
    artists: (ArtistMongoI & { _id: import('mongoose').Types.ObjectId })[],
    data: any[]
  ) {
    const allCountries: any[] = [];
    if (body.type === 'country') {
      for (const country of countries) {
        allCountries.push({ id: country.id, name: country.name, total: 0 });
      }
      for (const artist of artists) {
        for (const country of allCountries) {
          if (country.id === artist.country) {
            country.total++;
          }
        }
      }
      data = allCountries;
      data = data.sort(sortByTotal);
      data = data.splice(0, body.limit);
    }
    return data;
  }
}
