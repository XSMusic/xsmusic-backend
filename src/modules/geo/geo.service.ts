import {
  GeoAddressToCoordinatesDto,
  GeoCoordinatesToAddressDto,
  GeoCoordinatesToAddressI,
  GeoCoordinatesToAddressResponseI,
  GeoMapsResponseI,
} from '@geo';
import { slugify } from '@utils';
import axios from 'axios';

export class GeoService {
  addressToCoordinates(
    body: GeoAddressToCoordinatesDto
  ): Promise<{ coordinates: number[] }> {
    return new Promise(async (resolve, reject) => {
      try {
        const url =
          'https://maps.googleapis.com/maps/api/geocode/json?address=:address&key=AIzaSyBlCjDvXrwiNheH3t4YS8JGPc6iu7YfHzs'.replace(
            ':address',
            slugify(body.address)
          );
        const response = await axios.get<GeoMapsResponseI>(url);
        if (response.data.results.length > 0) {
          const coordinates = [
            Number(response.data.results[0].geometry.location.lat),
            Number(response.data.results[0].geometry.location.lng),
          ];
          resolve({ coordinates });
        } else {
          reject({ message: 'La direccion no es valida' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  coordinatesToAddress(
    body: GeoCoordinatesToAddressDto
  ): Promise<GeoCoordinatesToAddressResponseI> {
    return new Promise(async (resolve, reject) => {
      try {
        const url =
          'https://nominatim.openstreetmap.org/reverse?lat=:lat&lon=:lng&format=json&addressdetails=1&namedetails=0&accept-language=es';
        const response = await axios.get<GeoCoordinatesToAddressI>(
          url
            .replace(':lat', body.coordinates[0].toString())
            .replace(':lng', body.coordinates[1].toString())
        );
        const data: GeoCoordinatesToAddressResponseI = {
          street: `${response.data.address && response.data.address.road}${
            response.data.address && response.data.address.house_number
              ? `, ${
                  response.data.address && response.data.address.house_number
                }`
              : ''
          }`,
          town:
            response.data.address && response.data.address.city != null
              ? response.data.address && response.data.address.city
              : response.data.address && response.data.address.town,
          state: response.data.address && response.data.address.state,
          country: response.data.address && response.data.address.country_code,
        };
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }
}
