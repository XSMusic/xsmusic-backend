export interface GeoAddressToCoordinatesI {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
}

export interface GeoCoordinatesToAddressI {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: GeoCoordinatesToAddressItemAddressI;
  boundingbox: string[];
}

export interface GeoCoordinatesToAddressItemAddressI {
  railway: string;
  road: string;
  neighbourhood: string;
  city: string;
  county: string;
  state: string;
  'ISO3166-2-lvl4': string;
  postcode: string;
  country: string;
  country_code: string;
}
