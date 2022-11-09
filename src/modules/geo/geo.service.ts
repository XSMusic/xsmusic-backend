import {
  GeoAddressToCoordinatesI,
  GeoCoordinatesToAddressI,
  GeoCoordinatesToAddressResponseI,
} from '@geo';
import axios from 'axios';

export class GeoService {
  addressToCoordinates(address: string): Promise<{ coordinates: number[] }> {
    return new Promise(async (resolve, reject) => {
      const url =
        'https://nominatim.openstreetmap.org/search/:address?format=json&addressdetails=0&limit=0&polygon_svg=0'.replace(
          ':address',
          address
        );
      const response = await axios.get<GeoAddressToCoordinatesI[]>(url);
      console.log(address, url);
      if (response.data.length > 0) {
        const coordinates = [
          Number(response.data[0].lat),
          Number(response.data[0].lon),
        ];
        resolve({ coordinates });
      } else {
        reject({ message: 'La direccion no es valida' });
      }
    });
  }

  coordinatesToAddress(
    lat: string,
    lng: string
  ): Promise<GeoCoordinatesToAddressResponseI> {
    return new Promise(async (resolve, reject) => {
      try {
        const url =
          'https://nominatim.openstreetmap.org/reverse?lat=:lat&lon=:lng&format=json&addressdetails=1&namedetails=0&accept-language=es';
        const response = await axios.get<GeoCoordinatesToAddressI>(
          url.replace(':lat', lat).replace(':lng', lng)
        );
        const data: GeoCoordinatesToAddressResponseI = {
          street: response.data.address.railway,
          city: response.data.address.city,
          postcode: response.data.address.postcode,
          country: response.data.address.country_code,
        };
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }
}
