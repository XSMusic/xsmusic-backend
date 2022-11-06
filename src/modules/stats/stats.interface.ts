export interface StatsTotalsAdminI {
  artists: StatsTotalAdminItemI;
  styles: StatsTotalAdminItemI;
  sets: StatsTotalAdminItemI;
  tracks: StatsTotalAdminItemI;
  sites: StatsTotalAdminItemI;
  events: StatsTotalAdminItemI;
  users: StatsTotalAdminItemI;
}

export interface StatsTotalAdminItemI {
  total: number;
  percentages: { days: string; value: number }[];
}
