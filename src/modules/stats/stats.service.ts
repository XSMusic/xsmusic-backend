import { Artist } from '@artist';
import { Style, StyleMongoI } from '@style';
import { Document, Model } from 'mongoose';
import { StatsTotalsAdminI } from './stats.interface';
import { ArtistMongoI } from '../artist/artist.interface';

export class StatsService {
  getForAdmin(): Promise<StatsTotalsAdminI> {
    return new Promise(async (resolve, reject) => {
      try {
        const totals: StatsTotalsAdminI = {
          artists: await this.setTotal<ArtistMongoI>(Artist),
          styles: await this.setTotal<StyleMongoI>(Style),
          sets: 0,
          tracks: 0,
          clubs: 0,
          events: 0,
        };
        resolve(totals);
      } catch (error) {
        reject(error);
      }
    });
  }
    
  private setTotal<T>(model: Model<T>) {
    return model.countDocuments({}).exec();
  }
}
