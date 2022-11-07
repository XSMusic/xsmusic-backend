import { countries, get_month, slugify } from '@utils';
import axios from 'axios';
import { CheerioAPI, load } from 'cheerio';
import { ScrapingArtist, ScrapingGetInfoArtistDto } from '@scraping';
import { Style, StyleI } from '@style';

export class ScrapingService {
  private url_wikipedia = 'https://es.wikipedia.org/wiki';
  private url_clubbingspain = 'https://www.clubbingspain.com/artistas';
  private url_djrankings = 'https://djrankings.org/DJ-';
  styles: StyleI[] = [];

  async getInfoArtist(body: ScrapingGetInfoArtistDto): Promise<ScrapingArtist> {
    try {
      let artist = new ScrapingArtist(body.name);
      this.styles = await Style.find({}).exec();
      artist = await this.getInfoArtistDJRankings(artist);
      artist = await this.getInfoArtistWikipedia(artist);
      artist = await this.getInfoArtistClubbing(artist, body);
      return artist;
    } catch (error) {
      return error;
    }
  }

  private async getInfoArtistDJRankings(
    artist: ScrapingArtist
  ): Promise<ScrapingArtist> {
    return new Promise(async (resolve, reject) => {
      try {
        const url = `${this.url_djrankings}${slugify(
          artist.name,
          '_'
        ).toUpperCase()}`;
        const response = await axios.get(url);
        const $ = load(response.data);
        artist.styles = this.setStylesForDJRankings($);
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

  private setStylesForDJRankings($: CheerioAPI) {
    const stylesDB: any[] = [];
    const tdsInfo = $('#playerBioInfoList').find('td');
    const styles: string[] = $(tdsInfo[3]).text().split(', ');
    for (const style of styles) {
      const filter = this.styles.filter((s) => s.name === style);
      if (filter.length > 0) {
        stylesDB.push({
          _id: filter[0]._id,
          name: filter[0].name,
        });
      }
    }
    return stylesDB;
  }

  private async getInfoArtistClubbing(
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
        const url = `${this.url_clubbingspain}/${country}/${slugify(
          artist.name
        )}.html`;
        const response = await axios.get(url);
        const $ = load(response.data);
        artist.image.push(
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

  fixCountryClubbing(country: string): string {
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

  private getInfoArtistWikipedia(
    artist: ScrapingArtist
  ): Promise<ScrapingArtist> {
    return new Promise(async (resolve) => {
      try {
        const url = `${this.url_wikipedia}/${slugify(artist.name, '_', false)}`;
        const response = await axios.get(url);
        const $ = load(response.data);
        const image = $('img').attr('src');
        const image_split = image.split('//');
        artist.image.push('https://' + image_split[1]);
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
            console.log({ i });
            console.log({ infoLine: infoLine.replace(i, '') });
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
}
