export interface ScrapingSoundcloudI {
  collection: Collection[];
  total_results: number;
  next_href: string;
  query_urn: string;
}

interface Collection {
  avatar_url?: string;
  city?: string;
  comments_count?: number;
  country_code?: string;
  created_at: string;
  creator_subscriptions?: Creatorsubscription[];
  creator_subscription?: Creatorsubscription;
  description?: string;
  followers_count?: number;
  followings_count?: number;
  first_name?: string;
  full_name?: string;
  groups_count?: number;
  id: number;
  kind: string;
  last_modified: string;
  last_name?: string;
  likes_count?: number;
  playlist_likes_count?: number;
  permalink: string;
  permalink_url: string;
  playlist_count?: number;
  reposts_count?: number;
  track_count?: number;
  uri: string;
  urn: string;
  username?: string;
  verified?: boolean;
  visuals?: Visual2;
  badges?: Badges;
  station_urn: string;
  station_permalink: string;
  artwork_url?: string;
  caption?: any;
  commentable?: boolean;
  comment_count?: number;
  downloadable?: boolean;
  download_count?: number;
  duration?: number;
  full_duration?: number;
  embeddable_by?: string;
  genre?: string;
  has_downloads_left?: boolean;
  label_name?: string;
  license?: string;
  playback_count?: number;
  public?: boolean;
  publisher_metadata?: Publishermetadatum;
  purchase_title?: string;
  purchase_url?: string;
  release_date?: string;
  secret_token?: any;
  sharing?: string;
  state?: string;
  streamable?: boolean;
  tag_list?: string;
  title?: string;
  track_format?: string;
  user_id?: number;
  waveform_url?: string;
  display_date?: string;
  media?: Media;
  track_authorization?: string;
  monetization_model?: string;
  policy?: string;
  user?: User;
}

interface User {
  avatar_url: string;
  city?: string;
  comments_count: number;
  country_code?: string;
  created_at: string;
  creator_subscriptions: Creatorsubscription[];
  creator_subscription: Creatorsubscription;
  description?: string;
  followers_count: number;
  followings_count: number;
  first_name: string;
  full_name: string;
  groups_count: number;
  id: number;
  kind: string;
  last_modified: string;
  last_name: string;
  likes_count: number;
  playlist_likes_count: number;
  permalink: string;
  permalink_url: string;
  playlist_count: number;
  reposts_count?: any;
  track_count: number;
  uri: string;
  urn: string;
  username: string;
  verified: boolean;
  visuals?: Visual2;
  badges: Badges;
  station_urn: string;
  station_permalink: string;
}

interface Media {
  transcodings: Transcoding[];
}

interface Transcoding {
  url: string;
  preset: string;
  duration: number;
  snipped: boolean;
  format: Format;
  quality: string;
}

interface Format {
  protocol: string;
  mime_type: string;
}

interface Publishermetadatum {
  id: number;
  urn: string;
  artist?: string;
  album_title?: string;
  contains_music?: boolean;
  upc_or_ean?: string;
  isrc?: string;
  explicit?: boolean;
  p_line?: string;
  p_line_for_display?: string;
  c_line?: string;
  c_line_for_display?: string;
  release_title?: string;
  publisher?: string;
  writer_composer?: string;
}

interface Badges {
  pro: boolean;
  pro_unlimited: boolean;
  verified: boolean;
}

interface Visual2 {
  urn: string;
  enabled: boolean;
  visuals: Visual[];
  tracking?: any;
}

interface Visual {
  urn: string;
  entry_time: number;
  visual_url: string;
}

interface Creatorsubscription {
  product: Product;
}

interface Product {
  id: string;
}
