import moment from 'moment';
import { Model } from 'mongoose';
import {
  StatsGenericI,
  StatsTopGenericI,
  StatsTotalsAdminI,
  statsTopArtistAggregate,
  statsTopSitesAggregate,
  StatsGetTopStatsDto,
  StatsTotalAdminItemI,
  statsTopEventsAggregate,
} from '@stats';
import { Artist, ArtistMongoI } from '@artist';
import { Style, StyleMongoI } from '@style';
import { Media, MediaMongoI } from '@media';
import { countries, onlyUnique, sortByValue } from '@utils';
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

  getTopStats(body: StatsGetTopStatsDto): Promise<StatsGenericI> {
    return new Promise(async (resolve, reject) => {
      try {
        let items: any[];
        if (body.type === 'artist') {
          const aggregate = statsTopArtistAggregate();
          items = await Artist.aggregate(aggregate).exec();
        } else if (body.type === 'club') {
          const aggregate = statsTopSitesAggregate('club');
          items = await Site.aggregate(aggregate).exec();
        } else if (body.type === 'event') {
          const aggregate = statsTopEventsAggregate();
          items = await Event.aggregate(aggregate).exec();
        } else if (body.type === 'festival') {
          const aggregate = statsTopSitesAggregate('festival');
          items = await Site.aggregate(aggregate).exec();
        }
        let topCountries: StatsTopGenericI[] = [];
        let topSocial: StatsTopGenericI[] = [];
        let topStates: StatsTopGenericI[] = [];
        if (body.type !== 'event') {
          topCountries = await this.setTopCountries(items, body);
          topSocial = await this.setTopSocial(items, body);
        }
        if (
          body.type === 'event' ||
          body.type === 'club' ||
          body.type === 'festival'
        ) {
          topStates = this.setTopStates(items, body);
        }
        const topStyles = await this.setTopStyles(items, body);
        const topVarious = this.setTopVarious(items, body);
        const data: StatsGenericI = {
          topSocial,
          topCountries,
          topStyles,
          topStates,
          topVarious,
        };
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

  private setTopStates(items: any[], body: StatsGetTopStatsDto) {
    try {
      let states = [];
      const topStates: StatsTopGenericI[] = [];
      if (body.type === 'club' || body.type === 'festival') {
        for (const item of items) {
          if (item.address.state !== '') {
            states.push(item.address.state);
          }
        }
      } else {
        for (const item of items) {
          if (
            item.site &&
            item.site.address &&
            item.site.address.state !== ''
          ) {
            states.push(item.site.address.state);
          }
        }
      }
      states = states.filter(onlyUnique);
      for (const state of states) {
        topStates.push({
          name: state,
          value: 0,
          percentage: 0,
        });
      }

      if (body.type === 'club' || body.type === 'festival') {
        for (const item of items) {
          for (const state of topStates) {
            if (item.address.state === state.name) {
              state.value++;
              state.percentage = this.getPercentage(items.length, state.value);
            }
          }
        }
      } else if (body.type === 'event') {
        for (const item of items) {
          for (const state of topStates) {
            if (
              item.site &&
              item.site.address &&
              item.site.address.state === state.name
            ) {
              state.value++;
              state.percentage = this.getPercentage(items.length, state.value);
            }
          }
        }
      }
      topStates.sort(sortByValue);
      return topStates;
    } catch (error) {
      return error;
    }
  }

  private setTopVarious(items: any[], body: StatsGetTopStatsDto) {
    const topVarious: StatsTopGenericI[] = [];
    if (body.type === 'artist') {
      topVarious.push(
        { name: 'Sin info', value: 0, percentage: 0 },
        { name: 'Sin fecha nacimiento', value: 0, percentage: 0 }
      );
    } else if (
      body.type === 'club' ||
      body.type === 'festival' ||
      body.type === 'event'
    ) {
      topVarious.push({ name: 'Sin info', value: 0, percentage: 0 });
      topVarious.push({ name: 'Sin estilos', value: 0, percentage: 0 });
    }

    if (topVarious.length > 0) {
      for (const item of items) {
        for (const various of topVarious) {
          if (various.name === 'Sin info' && item.info.length === 0) {
            various.value++;
            various.percentage = this.getPercentage(
              items.length,
              various.value
            );
          }
          if (
            various.name === 'Sin fecha nacimiento' &&
            item.birthdate === ''
          ) {
            various.value++;
            various.percentage = this.getPercentage(
              items.length,
              various.value
            );
          }
          if (
            various.name === 'Sin estilos' &&
            item.styles &&
            item.styles.length === 0
          ) {
            various.value++;
            various.percentage = this.getPercentage(
              items.length,
              various.value
            );
          }
        }
      }
    }
    topVarious.sort(sortByValue);
    return topVarious;
  }

  private getPercentage(total: number, value: number) {
    return Number((100 / (total / value)).toFixed(1));
  }
}
