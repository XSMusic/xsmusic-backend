export class ScrapingArtist {
  name = '';
  images: string[] = [];
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

export class ScrapingSite {
  name = '';
  images: string[] = [];
  address: any = {
    street: '',
    town: '',
    state: '',
    country: '',
    coordinates: [],
  };
  constructor(name: string, poblation: string) {
    this.name = name;
    this.address.poblation = poblation;
  }
}
