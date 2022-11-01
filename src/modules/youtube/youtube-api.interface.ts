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
  videoId: string;
}

interface YoutubeApiPageInfoI {
  totalResults: number;
  resultsPerPage: number;
}
