import moment from 'moment';
import { Model } from 'mongoose';
import {
  StatsArtistsI,
  StatsTopCountriesI,
  StatsTopSocialI,
  StatsTotalsAdminI,
} from '@stats';
import { Artist, ArtistI, ArtistMongoI } from '@artist';
import { Style, StyleMongoI } from '@style';
import { Media, MediaMongoI } from '@media';
import { StatsGetTopStatsDto, StatsTotalAdminItemI } from '@stats';
import { countries, sortByValue } from '@utils';
import { User, UserMongoI } from '@user';
import { Site, SiteI, SiteMongoI } from '@site';
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

  getTopStats(body: StatsGetTopStatsDto): Promise<StatsArtistsI> {
    return new Promise(async (resolve, reject) => {
      try {
        let items: any[];
        if (body.type === 'artist') {
          items = await Artist.find({}).exec();
        } else if (body.type === 'club') {
          items = await Site.find({ type: 'club' }).exec();
        } else if (body.type === 'festival') {
          items = await Site.find({ type: 'festival' }).exec();
        }
        const topCountries: StatsTopCountriesI[] = await this.setTopCountries(
          items,
          body
        );
        const topSocial: StatsTopSocialI[] = this.setTopSocial(items, body);
        const data: StatsArtistsI = { topSocial, topCountries };
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }

  setTopCountries(
    items: any[],
    body: StatsGetTopStatsDto
  ): Promise<StatsTopCountriesI[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let data: StatsTopCountriesI[] = [];
        data = this.typeIsCountry(body, items, data);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  }

  private typeIsCountry(
    body: StatsGetTopStatsDto,
    items: any[],
    data: StatsTopCountriesI[]
  ): StatsTopCountriesI[] {
    const allCountries: StatsTopCountriesI[] = [];
    for (const country of countries) {
      allCountries.push({
        id: country.id,
        name: country.name,
        value: 0,
        percentage: 0,
      });
    }
    for (const item of items) {
      for (const country of allCountries) {
        if (body.type === 'artist' && country.id === item.country) {
          country.value++;
          country.percentage = this.getPercentage(items.length, country.value);
        } else if (
          (body.type === 'club' && country.id === item.address.country) ||
          (body.type === 'festival' && country.id === item.address.country)
        ) {
          country.value++;
          country.percentage = this.getPercentage(items.length, country.value);
        }
      }
    }
    data = allCountries;
    data = data.sort(sortByValue);
    data = data.splice(0, body.limit);
    return data;
  }

  private setTopSocial(artists: ArtistI[], body: StatsGetTopStatsDto) {
    const topSocial: StatsTopSocialI[] = [
      { name: 'facebook', value: 0, percentage: 0 },
      { name: 'instagram', value: 0, percentage: 0 },
      { name: 'twitter', value: 0, percentage: 0 },
      { name: 'web', value: 0, percentage: 0 },
      { name: 'youtube', value: 0, percentage: 0 },
      { name: 'ninguno', value: 0, percentage: 0 },
    ];
    if (body.type === 'artist') {
      topSocial.push(
        { name: 'soundcloud', value: 0, percentage: 0 },
        { name: 'mixcloud', value: 0, percentage: 0 },
        { name: 'spotify', value: 0, percentage: 0 },
        { name: 'tiktok', value: 0, percentage: 0 }
      );
    }

    for (const artist of artists) {
      for (let social of topSocial) {
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
        if (social.name === 'ninguno') {
          let type: 'artist' | 'site' = 'artist';
          if (body.type === 'club' || body.type === 'festival') {
            type = 'site';
          }
          social = this.setNothingSocial(social, artist, artists.length, type);
        }
      }
    }
    topSocial.sort(sortByValue);
    return topSocial;
  }

  private setNothingSocial(
    social: StatsTopSocialI,
    item: any,
    totalArtists: number,
    type: 'artist' | 'site'
  ) {
    if (
      type === 'artist' &&
      item.social.facebook === '' &&
      item.social.twitter === '' &&
      item.social.instagram === '' &&
      item.social.soundcloud === '' &&
      item.social.mixcloud === '' &&
      item.social.spotify === '' &&
      item.social.tiktok === '' &&
      item.social.youtube === ''
    ) {
      social.value++;
      social.percentage = this.getPercentage(totalArtists, social.value);
    } else if (
      type === 'site' &&
      item.social.facebook === '' &&
      item.social.twitter === '' &&
      item.social.instagram === '' &&
      item.social.youtube === ''
    ) {
      social.value++;
      social.percentage = this.getPercentage(totalArtists, social.value);
    }
    return social;
  }

  private getPercentage(total: number, value: number) {
    return Number((100 / (total / value)).toFixed(1));
  }
}
