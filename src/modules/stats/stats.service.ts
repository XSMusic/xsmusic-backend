import { Artist } from '@artist';
import { Style, StyleMongoI } from '@style';
import { Model } from 'mongoose';
import { StatsTotalsAdminI } from './stats.interface';
import { ArtistMongoI } from '../artist/artist.interface';
import { Media } from '@media';

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
}
