import moment from 'moment';
import * as os from 'os';
import { exec } from 'child_process';
import { XMLBuilder } from 'fast-xml-parser';
import { SiteMapI } from '@system';
import fs from 'fs';
import { Artist } from '@artist';
import { Site } from '@site';
import { Media } from '@media';
import { Event } from '@event';
import { Logger } from '@services';

export class SystemService {
  url = 'https://xsmusic.es';

  async getResume() {
    try {
      const freeMemory = this.bytesToSize(os.freemem());
      const totalMemory = this.bytesToSize(os.totalmem());
      const upTime = moment(moment().unix() * 1000)
        .locale('es')
        .fromNow();

      const hdd = await this.hdd();
      return {
        memory: {
          value: `${freeMemory}/${totalMemory}`,
          percentage: `${(Number(os.freemem) / Number(os.totalmem)).toFixed(
            2
          )}%`,
        },
        upTime,
        hdd,
      };
    } catch (e) {
      return e;
    }
  }

  private bytesToSize(bytes: number) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    const i = Number(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  }

  hdd() {
    return new Promise((resolve, reject) => {
      exec('df -k', (error, stdout) => {
        if (error) {
          reject();
        }
        let total = 0;
        let used = 0;
        let free = 0;
        const lines = stdout.split('\n');
        const str_disk_info = lines[1].replace(/[\s\n\r]+/g, ' ');
        const disk_info = str_disk_info.split(' ');
        total = Math.ceil((Number(disk_info[1]) * 1024) / Math.pow(1024, 2));
        used = Math.ceil((Number(disk_info[2]) * 1024) / Math.pow(1024, 2));
        free = Math.ceil((Number(disk_info[3]) * 1024) / Math.pow(1024, 2));
        resolve({ total, free, used });
      });
    });
  }

  async generateSitemaps() {
    try {
      const staticUrls: SiteMapI[] = this.setStaticValues();
      const dinamicUrls: SiteMapI[] = await this.setDynamicValues();
      const builderStatics = new XMLBuilder({
        arrayNodeName: 'url',
      });
      const xmlContent = `
        <?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
                ${builderStatics.build(staticUrls)}
                ${builderStatics.build(dinamicUrls)}
            </urlset>
        `;
      fs.writeFile(`../app/src/sitemap.xml`, xmlContent, (err) => {
        if (err) {
          return err;
        }
      });
      return { message: 'Archivo generado' };
    } catch (error) {
      Logger.error(error);
      return error;
    }
  }

  private setStaticValues() {
    const staticUrls: SiteMapI[] = [];
    const staticValues = [
      'artists',
      'club',
      'events',
      'festivals',
      'sets',
      'tracks',
    ];
    for (const value of staticValues) {
      staticUrls.push({
        loc: `${this.url}/${value}`,
        lastmod: moment().format('YYYY-MM-DD'),
      });
    }
    return staticUrls;
  }

  private async setDynamicValues() {
    const dynamicUrls: SiteMapI[] = [];
    const models: any[] = [
      { model: Artist, url: 'artists' },
      { model: Event, url: 'events' },
      { model: Site, url: 'clubs', subtype: 'club' },
      { model: Site, url: 'festivals', subtype: 'festival' },
      { model: Media, url: 'sets', subtype: 'set' },
      { model: Media, url: 'tracks', subtype: 'track' },
    ];
    for (const model of models) {
      let data: any = {};
      if (model.subtype) {
        data = { type: model.subtype };
      }
      const items = await model.model.find(data).exec();
      for (const item of items) {
        dynamicUrls.push({
          loc: `${this.url}/${model.url}/${item.slug}`,
          lastmod: moment(item.updated).format('YYYY-MM-DD'),
        });
      }
    }
    return dynamicUrls;
  }
}
