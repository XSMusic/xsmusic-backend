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

export class ScrapingSite {
  name = '';
  image = '';
  address = {
    street: '',
    poblation: '',
    country: '',
  };
  constructor(name: string, poblation: string) {
    this.name = name;
    this.address.poblation = poblation;
  }
}
