import moment from 'moment';
import { Model } from 'mongoose';
import {
  StatsArtistsI,
  StatsTopGenericI,
  StatsTotalsAdminI,
  statsTopArtistAggregate,
  statsTopSitesAggregate,
  StatsGetTopStatsDto,
  StatsTotalAdminItemI,
} from '@stats';
import { Artist, ArtistMongoI } from '@artist';
import { Style, StyleMongoI } from '@style';
import { Media, MediaMongoI } from '@media';
import { countries, sortByValue } from '@utils';
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

  getTopStats(body: StatsGetTopStatsDto): Promise<StatsArtistsI> {
    return new Promise(async (resolve, reject) => {
      try {
        let items: any[];
        if (body.type === 'artist') {
          const aggregate = statsTopArtistAggregate();
          items = await Artist.aggregate(aggregate).exec();
        } else if (body.type === 'club') {
          const aggregate = statsTopSitesAggregate('club');
          items = await Site.aggregate(aggregate).exec();
        } else if (body.type === 'festival') {
          const aggregate = statsTopSitesAggregate('festival');
          items = await Site.aggregate(aggregate).exec();
        }
        const topCountries: StatsTopGenericI[] = await this.setTopCountries(
          items,
          body
        );
        const topSocial = await this.setTopSocial(items, body);
        const topStyles = await this.setTopStyles(items, body);
        const data: StatsArtistsI = { topSocial, topCountries, topStyles };
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }

  setTopCountries(
    items: any[],
    body: StatsGetTopStatsDto
  ): Promise<StatsTopGenericI[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const data: StatsTopGenericI[] = this.typeIsCountry(body, items);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  }

  private typeIsCountry(
    body: StatsGetTopStatsDto,
    items: any[]
  ): StatsTopGenericI[] {
    const allCountries: StatsTopGenericI[] = [];
    for (const country of countries) {
      allCountries.push({
        id: country.id,
        name: country.name,
        value: 0,
        percentage: 0,
      });
    }
    let data: StatsTopGenericI[] = allCountries;
    for (const item of items) {
      for (const country of allCountries) {
        if (
          (body.type === 'artist' && country.id === item.country) ||
          (body.type === 'club' && country.id === item.address.country) ||
          (body.type === 'festival' && country.id === item.address.country)
        ) {
          country.value++;
          country.percentage = this.getPercentage(items.length, country.value);
        }
      }
    }

    data = data.sort(sortByValue);
    data = data.splice(0, body.limit);
    return data;
  }

  private setTopSocial(items: any[], body: StatsGetTopStatsDto) {
    try {
      const topSocial: StatsTopGenericI[] = [
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

      for (const artist of items) {
        for (let social of topSocial) {
          if (
            social.name === 'facebook' &&
            artist.social &&
            artist.social?.facebook !== ''
          ) {
            social.value++;
            social.percentage = this.getPercentage(items.length, social.value);
          }
          if (
            social.name === 'instagram' &&
            artist.social &&
            artist.social.instagram !== ''
          ) {
            social.value++;
            social.percentage = this.getPercentage(items.length, social.value);
          }
          if (
            social.name === 'mixcloud' &&
            artist.social &&
            artist.social.mixcloud !== ''
          ) {
            social.value++;
            social.percentage = this.getPercentage(items.length, social.value);
          }
          if (
            social.name === 'soundcloud' &&
            artist.social &&
            artist.social.soundcloud !== ''
          ) {
            social.value++;
            social.percentage = this.getPercentage(items.length, social.value);
          }
          if (
            social.name === 'spotify' &&
            artist.social &&
            artist.social.spotify !== ''
          ) {
            social.value++;
            social.percentage = this.getPercentage(items.length, social.value);
          }
          if (
            social.name === 'tiktok' &&
            artist.social &&
            artist.social.tiktok !== ''
          ) {
            social.value++;
            social.percentage = this.getPercentage(items.length, social.value);
          }
          if (
            social.name === 'twitter' &&
            artist.social &&
            artist.social.twitter !== ''
          ) {
            social.value++;
            social.percentage = this.getPercentage(items.length, social.value);
          }
          if (
            social.name === 'web' &&
            artist.social &&
            artist.social.web !== ''
          ) {
            social.value++;
            social.percentage = this.getPercentage(items.length, social.value);
          }
          if (
            social.name === 'youtube' &&
            artist.social &&
            artist.social.youtube !== ''
          ) {
            social.value++;
            social.percentage = this.getPercentage(items.length, social.value);
          }
          if (social.name === 'ninguno') {
            let type: 'artist' | 'site' = 'artist';
            if (body.type === 'club' || body.type === 'festival') {
              type = 'site';
            }
            social = this.setNothingSocial(social, artist, items.length, type);
          }
        }
      }
      topSocial.sort(sortByValue);
      return topSocial;
    } catch (error) {
      return error;
    }
  }

  private setNothingSocial(
    social: StatsTopGenericI,
    item: any,
    totalArtists: number,
    type: 'artist' | 'site'
  ) {
    if (
      type === 'artist' &&
      item.social &&
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
      item.social &&
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

  async setTopStyles(
    items: any[],
    body: StatsGetTopStatsDto
  ): Promise<StatsTopGenericI[]> {
    try {
      let styles: StatsTopGenericI[] = [];
      const stylesDB = await Style.find({}).exec();
      stylesDB.map((item) =>
        styles.push({ name: item.name, value: 0, percentage: 0 })
      );
      for (const item of items) {
        for (const style of styles) {
          item.styles.forEach((item: any) => {
            if (item.name === style.name) {
              style.value++;
              style.percentage = this.getPercentage(items.length, style.value);
            }
          });
        }
      }
      styles.sort(sortByValue);
      styles = styles.splice(0, body.limit);
      return styles;
    } catch (error) {
      return error;
    }
  }

  private getPercentage(total: number, value: number) {
    return Number((100 / (total / value)).toFixed(1));
  }
}
