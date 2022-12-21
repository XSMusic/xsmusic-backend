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

export interface ScrapingMediaYoutubeI {
  name: string;
  channel: {
    id: string;
    name: string;
  };
  videoId: string;
  info: string;
  image: string;
}

export interface YoutubeApiRootI {
  kind: string;
  etag: string;
  nextPageToken: string;
  regionCode: string;
  pageInfo: YoutubeApiPageInfoI;
  items: YoutubeApiItemI[];
}

interface YoutubeApiItemI {
  kind: string;
  etag: string;
  id: YoutubeApiItemIdI;
  snippet: YoutubeApiItemSnippetI;
}

interface YoutubeApiItemSnippetI {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: YoutubeApiItemSnippetThumbnailsI;
  channelTitle: string;
  liveBroadcastContent: string;
  publishTime: string;
}

interface YoutubeApiItemSnippetThumbnailsI {
  default: YoutubeApIItemSnippetThumbnailsDefaultI;
  medium: YoutubeApIItemSnippetThumbnailsDefaultI;
  high: YoutubeApIItemSnippetThumbnailsDefaultI;
}

interface YoutubeApIItemSnippetThumbnailsDefaultI {
  url: string;
  width: number;
  height: number;
}

interface YoutubeApiItemIdI {
  kind: string;
  videoId?: string;
  channelId?: string;
}

interface YoutubeApiPageInfoI {
  totalResults: number;
  resultsPerPage: number;
}

export interface ScrapingEventRaI {
  title: string;
  date: string;
  content: string;
  images: ScrapingEventRaImageI[];
  venue: ScrapingEventRaVenueI;
}

export interface ScrapingEventRaVenueI {
  name: string;
  contentUrl?: any;
  id?: string;
}

interface ScrapingEventRaImageI {
  filename: string;
}

export interface ScrapingEventsI {
  completed: ScrapingEventI[];
  notCompleted: ScrapingEventI[];
}

export interface ScrapingEventI {
  name: string;
  date: string;
  info?: string;
  images: string[];
  site: any;
}

export interface ScrapingSearchNameYoutubeI {
  id: string;
  name: string;
  image: string;
}
