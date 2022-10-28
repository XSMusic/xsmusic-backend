import { countries, get_month, slugify } from '@utils';
import axios from 'axios';
import { load } from 'cheerio';
import { ScrapingArtist, ScrapingGetInfoArtistDto } from '@scraping';

// TODO: Obtener info de wikipedia

export class ScrapingService {
  private url_wikipedia = 'https://es.wikipedia.org/wiki';
  private url_clubbingspain = 'https://www.clubbingspain.com/artistas';
  private url_djrankings = 'https://djrankings.org/DJ-';
  constructor() {
    this.getInfoArtist({ name: 'David Guetta', countryCode: '' });
  }

  async getInfoArtist(body: ScrapingGetInfoArtistDto): Promise<ScrapingArtist> {
    try {
      let artist = new ScrapingArtist(body.name);
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
        const tdsInfo = $('#playerBioInfoList').find('td');
        artist.styles = $(tdsInfo[3]).text().split(', ');
        $('img').each(function () {
          if ($(this).attr('src').includes('/tpls/img/flags/24/')) {
            const countryImg = $(this)
              .attr('src')
              .split('/tpls/img/flags/24/')[1];
            artist.country = countryImg.split('.png')[0];
          }
        });
        resolve(artist);
      } catch (e) {
        reject(e);
      }
    });
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
        artist.info.push($('h3:contains("Biografía")').next().text());
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

        $('th').each(function () {
          const th = $(this).text();
          if (th.includes('Nacimiento')) {
            const birthdate: any = $(this).next().text();
            let birthdate_replaced = birthdate.split('(')[0];
            birthdate_replaced = birthdate_replaced.replace('de ', '');
            const birthdate_array = birthdate_replaced.split(' ');
            if (birthdate_array[0]) {
              const day = Number(birthdate_array[0].split('\n')[1])
              const month_es = birthdate_array[1];
                const month = get_month(month_es);
              const year = Number(birthdate_array[3]);
              const date =
                  year.toString() + '-' + month.toString() + '-' + day.toString();
              artist.birthdate = date;
            }
          }
        });
        resolve(artist);
      } catch (error) {
        resolve(artist);
      }
    });
  }

  private getCountryFromCode(countryCode: string): string {
    const countryName = countries.find((item) => item.id === countryCode);
    if (countryName) {
      return slugify(countryName.name);
    } else {
      return '';
    }
  }
}
