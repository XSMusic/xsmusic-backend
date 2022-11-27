import { config } from '@core/config';
import { ScrapingSoundcloudI } from '@scraping';
import { Style } from '@style';
import { slugify, get_month, countries } from '@utils';
import axios from 'axios';
import { load, CheerioAPI } from 'cheerio';
import { ScrapingGetInfoArtistDto } from './scraping.dto';
import { ScrapingArtist } from './scraping.model';

export class ScrapingArtistService {
  private urlWikipedia = 'https://es.wikipedia.org/wiki';
  private urlClubbingspain = 'https://www.clubbingspain.com/artistas';
  private urlDjrankings = 'https://djrankings.org/DJ-';
  private urlSoundcloudSearch = `https://api-v2.soundcloud.com/search?q=:searchText&client_id=${config.tokens.soundcloud}&limit=20&offset=0'`;

  async getInfoArtistDJRankings(
    artist: ScrapingArtist
  ): Promise<ScrapingArtist> {
    return new Promise(async (resolve, reject) => {
      try {
        const url = `${this.urlDjrankings}${slugify(
          artist.name,
          '_'
        ).toUpperCase()}`;
        const response = await axios.get(url);
        const $ = load(response.data);
        artist.styles = await this.setStylesForDJRankings($);
        artist.country = this.setImageForDJRankings($);
        resolve(artist);
      } catch (e) {
        reject(e);
      }
    });
  }

  private setImageForDJRankings($: CheerioAPI) {
    let image = '';
    $('img').each(function (): any {
      if ($(this).attr('src').includes('/tpls/img/flags/24/')) {
        const countryImg = $(this).attr('src').split('/tpls/img/flags/24/')[1];
        image = countryImg.split('.png')[0];
      }
    });
    return image;
  }

  private async setStylesForDJRankings($: CheerioAPI) {
    const stylesFind = await Style.find({}).exec();
    const stylesDB: any[] = [];
    const tdsInfo = $('#playerBioInfoList').find('td');
    const styles: string[] = $(tdsInfo[3]).text().split(', ');
    for (const style of styles) {
      const filter = stylesFind.filter((s) => s.name === style);
      if (filter.length > 0) {
        stylesDB.push({
          _id: filter[0]._id,
          name: filter[0].name,
        });
      }
    }
    return stylesDB;
  }

  async getInfoArtistClubbing(
    artist: ScrapingArtist,
    body: ScrapingGetInfoArtistDto
  ): Promise<ScrapingArtist> {
    return new Promise(async (resolve) => {
      try {
        if (artist.country === '') {
          artist.country = slugify(body.countryCode);
        }
        let country = this.getCountryFromCode(artist.country);
        country = this.fixCountryClubbing(country);
        const url = `${this.urlClubbingspain}/${country}/${slugify(
          artist.name
        )}.html`;
        const response = await axios.get(url);
        const $ = load(response.data);
        artist.images.push(
          'https://clubbingspain.com' + $('.border-radius-5').attr('src')
        );
        artist.info.push($('h3:contains("Biografía")').next().html());
        $('a').each(function () {
          const href = $(this).attr('href');
          if (href.includes('facebook')) {
            artist.social.facebook = href;
          } else if (href.includes('twitter')) {
            artist.social.twitter = href;
          } else if (href.includes('soundcloud')) {
            artist.social.soundcloud = href;
          } else if (href.includes('spotify')) {
            artist.social.spotify = href;
          } else if (href.includes('http://www.')) {
            artist.social.web = href;
          }
        });
        resolve(artist);
      } catch (e) {
        resolve(artist);
      }
    });
  }

  private fixCountryClubbing(country: string): string {
    if (country === 'estados-unidos') {
      return 'usa';
    } else if (country === 'reino-unido') {
      return 'uk';
    } else if (country === 'paises-bajos') {
      return 'holanda';
    } else {
      return country;
    }
  }

  getInfoArtistWikipedia(artist: ScrapingArtist): Promise<ScrapingArtist> {
    return new Promise(async (resolve) => {
      try {
        const url = `${this.urlWikipedia}/${slugify(artist.name, '_', false)}`;
        const response = await axios.get(url);
        const $ = load(response.data);
        const image = $('img').attr('src');
        const image_split = image.split('//');
        artist.images.push('https://' + image_split[1]);
        artist = this.setInfoForWikipedia($, artist);
        artist = this.setBirthdateForWikipedia($, artist);
        resolve(artist);
      } catch (error) {
        resolve(artist);
      }
    });
  }

  private setBirthdateForWikipedia($: CheerioAPI, artist: ScrapingArtist) {
    $('th').each(function () {
      const th = $(this).text();
      if (th.includes('Nacimiento')) {
        const birthdate: any = $(this).next().text();
        let birthdate_replaced = birthdate.split('(')[0];
        birthdate_replaced = birthdate_replaced.replace('de ', '');
        const birthdate_array = birthdate_replaced.split(' ');
        if (birthdate_array[0]) {
          const day = Number(birthdate_array[0].split('\n')[1]);
          const month_es = birthdate_array[1];
          const month = get_month(month_es);
          const year = Number(birthdate_array[3]);
          const date =
            year.toString() + '-' + month.toString() + '-' + day.toString();
          artist.birthdate = date;
        }
      }
    });
    return artist;
  }

  private setInfoForWikipedia($: CheerioAPI, artist: ScrapingArtist) {
    const wikiCodes = this.getWikiCodes();
    let info = '';
    $('.mw-parser-output')
      .find('p')
      .each(function () {
        let infoLine = $(this).text() + '<br><br>';
        let infoLineItem = '';
        for (const i of wikiCodes) {
          if (infoLine.includes(i)) {
            infoLine = infoLine.replace(i, '');
            infoLineItem = infoLine;
          }
        }
        if (info === '') {
          info = infoLineItem;
        } else {
          info = `${info} ${infoLineItem}`;
        }
      });
    artist.info.push(info);
    return artist;
  }

  private getCountryFromCode(countryCode: string): string {
    const countryName = countries.find((item) => item.id === countryCode);
    if (countryName) {
      return slugify(countryName.name);
    } else {
      return '';
    }
  }

  private getWikiCodes = (): string[] => {
    const items = [];
    let i = 0;
    while (i < 20) {
      i++;
      items.push(`[${i}]`);
    }
    return items;
  };

  searchNameSoundcloud(name: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get<ScrapingSoundcloudI>(
          this.urlSoundcloudSearch.replace(':searchText', name)
        );
        const items: any[] = [];
        for (const item of response.data.collection) {
          item.full_name;
          if (item.full_name) {
            items.push({
              name: item.full_name,
              image: item.avatar_url,
              country: item.country_code,
              url: item.permalink_url,
            });
          }
        }
        resolve(items);
      } catch (e) {
        reject(e);
      }
    });
  }
}
