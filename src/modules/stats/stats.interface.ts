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

export interface StatsGetTopArtistsI {
  id: string;
  name: string;
  total: number;
}
