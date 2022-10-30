export interface YoutubeI {
  name: string;
  channel: {
    id: string;
    name: string;
  };
  videoId: string;
  info: string;
  image: string;
}
