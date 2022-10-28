export interface ScrapingArtistI {
  name: string;
  birthdate: string;
  image: string[];
  info: string[];
  social: {
    web: string;
    facebook: string;
    twitter: string;
    spotify: string;
    soundcloud: string;
  };
}
