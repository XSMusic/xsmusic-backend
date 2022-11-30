export interface StatsTotalsAdminI {
  artists: StatsTotalAdminItemI;
  clubs: StatsTotalAdminItemI;
  events: StatsTotalAdminItemI;
  festivals: StatsTotalAdminItemI;
  images: StatsTotalAdminItemI;
  sets: StatsTotalAdminItemI;
  styles: StatsTotalAdminItemI;
  tracks: StatsTotalAdminItemI;
  users: StatsTotalAdminItemI;
}

export interface StatsTotalAdminItemI {
  total: number;
  percentages: { days: string; value: number }[];
}

export interface StatsArtistsI {
  topSocial: StatsTopSocialI[];
  topCountries: StatsTopCountriesI[];
}

export interface StatsTopSocialI {
  name: string;
  value: number;
  percentage: number;
}

export interface StatsTopCountriesI extends StatsTopSocialI {
  id: string;
}
