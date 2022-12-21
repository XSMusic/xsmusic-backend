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

export interface StatsGenericI {
  topSocial: StatsTopGenericI[];
  topCountries: StatsTopGenericI[];
  topStyles?: StatsTopGenericI[];
  topStates?: StatsTopGenericI[];
  topVarious?: StatsTopGenericI[];
}

export interface StatsTopGenericI {
  id?: string;
  name: string;
  value: number;
  percentage: number;
}
