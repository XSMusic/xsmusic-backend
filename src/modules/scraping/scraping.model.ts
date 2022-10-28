export class ScrapingArtist {
  name = '';
  image: string[] = [];
  birthdate = '';
  styles: any[] = [];
  country = '';
  gender = '';
  info: string[] = [];
  social = {
    web: '',
    facebook: '',
    twitter: '',
    spotify: '',
    soundcloud: '',
  };
  constructor(name: string) {
    this.name = name;
  }
}
