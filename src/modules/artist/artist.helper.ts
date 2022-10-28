// import { slugify } from '@utils';
// import axios from 'axios';
// import { load } from 'cheerio';

// export class ArtistHelper {
//   private url_wikipedia = 'https://es.wikipedia.org/wiki/';
//   private url_clubbingspain = 'https://www.clubbingspain.com/artistas/';
//   constructor() {
//     console.log('artistHelper');
//     this.scrapingClubbing('paco osuna');
//   }

//   async scrapingClubbing(name: string) {
//     try {
//       const url = this.url_clubbingspain + '/espana/' + slugify(name) + '.html';
//       const response = await axios.get(url);
//       const $ = load(response.data);
//       const image =
//         'https://clubbingspain.com' + $('.border-radius-5').attr('src');
//       const info = $('h3:contains("Biografía")').next().text();
//       let facebook = '';
//       let twitter = '';
//       let soundcloud = '';
//       let spotify = '';
//       let web = '';
//       $('a').each(function () {
//         const href = $(this).attr('href');
//         if (href.includes('facebook')) {
//           facebook = href;
//         } else if (href.includes('twitter')) {
//           twitter = href;
//         } else if (href.includes('soundcloud')) {
//           soundcloud = href;
//         } else if (href.includes('spotify')) {
//           spotify = href;
//         } else if (href.includes('http://www.')) {
//           web = href;
//         }
//       });
//       const artist: any = {
//         name,
//         image,
//         info,
//         facebook,
//         twitter,
//         soundcloud,
//         spotify,
//         web,
//       };
//         console.log(artist);
//     } catch (e) {
//       console.error(e.message);
//     }
//   }
// }
