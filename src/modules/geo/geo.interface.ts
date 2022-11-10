export interface GeoMapsResponseI {
  results: GeoMapsResponseResultI[];
  status: string;
}

interface GeoMapsResponseResultI {
  geometry: GeoMapsResponseGeometryI;
}

interface GeoMapsResponseGeometryI {
  location: GeoMapsResponseLocationI;
}

interface GeoMapsResponseLocationI {
  lat: number;
  lng: number;
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
  house_number?: string;
}

export interface GeoCoordinatesToAddressResponseI {
  street: string;
  city: string;
  postcode: string;
  country: string;
}
