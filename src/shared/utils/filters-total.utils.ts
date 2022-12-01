import { GetAllDto } from '@dtos';

export const getFilter = (
  type: 'artist' | 'event' | 'media' | 'site',
  body: GetAllDto
) => {
  if (body.filter && body.filter.length === 2) {
    let data: any = {};
    if (body.filter[0] === 'name') {
      data = {
        $match: {
          $or: [],
        },
      };
      if (type === 'event') {
        data.$match.$or.push(
          { date: { $gte: new Date().toISOString() } },
          getFieldByName('site.address.country', body.filter),
          getFieldByName('site.address.town', body.filter),
          getFieldByName('site.address.state', body.filter)
        );
      } else if (type === 'site') {
        data.$match.$or.push(
          getFieldByName('address.country', body.filter),
          getFieldByName('address.town', body.filter),
          getFieldByName('address.state', body.filter)
        );
      }
      data.$match.$or.push(
        getFieldByName('name', body.filter),
        getFieldByName('birthdate', body.filter),
        getFieldByName('country', body.filter),
        getFieldByName('styles.name', body.filter)
      );
    } else {
      if (type === 'event') {
        data = {
          $match: {
            [body.filter[0] === 'styles'
              ? 'styles.name'
              : body.filter[0] === 'country'
              ? 'site.address.country'
              : body.filter[0] === 'town'
              ? 'site.address.town'
              : body.filter[0] === 'state'
              ? 'site.address.state'
              : body.filter[0]]: body.filter[1],
          },
        };
      } else if (type === 'site') {
        data = {
          $match: {
            [body.filter[0] === 'styles'
              ? 'styles.name'
              : body.filter[0] === 'country'
              ? 'address.country'
              : body.filter[0] === 'town'
              ? 'address.town'
              : body.filter[0] === 'state'
              ? 'address.state'
              : body.filter[0]]: body.filter[1],
          },
        };
      } else {
        data = {
          $match: {
            [body.filter[0] === 'styles'
              ? 'styles.name'
              : body.filter[0] === 'country'
              ? 'country'
              : body.filter[0]]: body.filter[1],
          },
        };
      }
    }
    return data;
  }
};

export const getFieldByName = (type: string, filter: string[]) => {
  return { [type]: { $regex: `${filter[1]}`, $options: 'i' } };
};
