import moment from 'moment';
import { Model } from 'mongoose';
import {
  StatsArtistsI,
  StatsGetTopArtistsI,
  StatsTopSocialI,
  StatsTotalsAdminI,
} from '@stats';
import { Artist, ArtistI, ArtistMongoI } from '@artist';
import { Style, StyleMongoI } from '@style';
import { Media, MediaMongoI } from '@media';
import { StatsGetTopArtistsDto, StatsTotalAdminItemI } from '@stats';
import { countries, sortByTotal } from '@utils';
import { User, UserMongoI } from '@user';
import { Site, SiteMongoI } from '@site';
import { Image, ImageMongoI } from '@image';
import { Event, EventMongoI } from '@event';

export class StatsService {
  getForAdmin(): Promise<StatsTotalsAdminI> {
    return new Promise(async (resolve, reject) => {
      try {
        const totals: StatsTotalsAdminI = {
          artists: await this.setTotal<ArtistMongoI>(Artist),
          styles: await this.setTotal<StyleMongoI>(Style),
          sets: await this.setTotal<MediaMongoI>(Media, 'set'),
          tracks: await this.setTotal<MediaMongoI>(Media, 'track'),
          clubs: await this.setTotal<SiteMongoI>(Site, 'club'),
          festivals: await this.setTotal<SiteMongoI>(Site, 'festival'),
          images: await this.setTotal<ImageMongoI>(Image),
          events: await this.setTotal<EventMongoI>(Event),
          users: await this.setTotal<UserMongoI>(User),
        };
        resolve(totals);
      } catch (error) {
        reject(error);
      }
    });
  }

  private async setTotal<T>(
    model: Model<T>,
    type?: string
  ): Promise<StatsTotalAdminItemI> {
    const daysComparation = [3, 7];
    const body = type ? { type } : {};
    const total = await model.countDocuments(body).exec();
    const percentages = [];
    for (const days of daysComparation) {
      const dateComparation = moment().add(`-${days}`, 'day');
      const created = {
        created: {
          $gte: dateComparation.toISOString(),
          $lt: moment().toISOString(),
        },
      };
      const bodyComparation = type ? { $and: [{ type }, created] } : created;
      const value = await model.countDocuments(bodyComparation).exec();
      percentages.push({
        days: days.toString(),
        value: Number((100 / (total / value)).toFixed(1)),
      });
    }
    return {
      total,
      percentages,
    };
  }

  getTopArtists(body: StatsGetTopArtistsDto): Promise<StatsGetTopArtistsI[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const artists = await Artist.find({}).exec();
        let data: StatsGetTopArtistsI[] = [];
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
    data: StatsGetTopArtistsI[]
  ): StatsGetTopArtistsI[] {
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

  getStatsArtists(): Promise<StatsArtistsI> {
    return new Promise(async (resolve, reject) => {
      try {
        const artists = await Artist.find({}).exec();
        let topSocial: StatsTopSocialI[] = [
          { name: 'facebook', value: 0, percentage: 0 },
          { name: 'instagram', value: 0, percentage: 0 },
          { name: 'mixcloud', value: 0, percentage: 0 },
          { name: 'soundcloud', value: 0, percentage: 0 },
          { name: 'spotify', value: 0, percentage: 0 },
          { name: 'tiktok', value: 0, percentage: 0 },
          { name: 'twitter', value: 0, percentage: 0 },
          { name: 'web', value: 0, percentage: 0 },
          { name: 'youtube', value: 0, percentage: 0 },
        ];
        topSocial = this.setTopSocial(artists, topSocial);
        const data: StatsArtistsI = { topSocial };
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }

  private setTopSocial(artists: ArtistI[], topSocial: StatsTopSocialI[]) {
    for (const artist of artists) {
      for (const social of topSocial) {
        if (social.name === 'facebook' && artist.social.facebook !== '') {
          social.value++;
          social.percentage = this.getPercentage(artists.length, social.value);
        }
        if (social.name === 'instagram' && artist.social.instagram !== '') {
          social.value++;
          social.percentage = this.getPercentage(artists.length, social.value);
        }
        if (social.name === 'mixcloud' && artist.social.mixcloud !== '') {
          social.value++;
          social.percentage = this.getPercentage(artists.length, social.value);
        }
        if (social.name === 'soundcloud' && artist.social.soundcloud !== '') {
          social.value++;
          social.percentage = this.getPercentage(artists.length, social.value);
        }
        if (social.name === 'spotify' && artist.social.spotify !== '') {
          social.value++;
          social.percentage = this.getPercentage(artists.length, social.value);
        }
        if (social.name === 'tiktok' && artist.social.tiktok !== '') {
          social.value++;
          social.percentage = this.getPercentage(artists.length, social.value);
        }
        if (social.name === 'twitter' && artist.social.twitter !== '') {
          social.value++;
          social.percentage = this.getPercentage(artists.length, social.value);
        }
        if (social.name === 'web' && artist.social.web !== '') {
          social.value++;
          social.percentage = this.getPercentage(artists.length, social.value);
        }
        if (social.name === 'youtube' && artist.social.youtube !== '') {
          social.value++;
          social.percentage = this.getPercentage(artists.length, social.value);
        }
      }
    }
    topSocial.sort((a, b) => (a.value > b.value ? -1 : 1));
    return topSocial;
  }

  private getPercentage(total: number, value: number) {
    return Number((100 / (total / value)).toFixed(1));
  }
}
