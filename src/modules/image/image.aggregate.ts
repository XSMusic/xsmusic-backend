import { ImageGetAllDto } from '@image';
import { getOrderForGetAllAggregate } from '@utils';

export const imageGetAllAggregate = (
  body: ImageGetAllDto,
  skip: number,
  pageSize: number
): any => {
  const sort = getOrderForGetAllAggregate(body);
  let data: any = [];
  data = addLookups(data);
  if (body.type !== 'all') {
    data.push({ $match: { type: body.type } });
  }
  data = setFilter(body, data);
  data.push({ $sort: sort }, { $skip: skip }, { $limit: pageSize });
  //   data = addProject(data);
  return data;
};

const addLookups = (data: any[]) => {
  data.push({
    $lookup: {
      from: 'styles',
      localField: 'styles',
      foreignField: '_id',
      as: 'styles',
      pipeline: [{ $project: { _id: 1, name: 1, colors: 1 } }],
    },
  });
};

const setFilter = (body: ImageGetAllDto, data: any) => {
  if (body.filter && body.filter.length === 2) {
    let d = {};
    if (body.filter[0] === 'name') {
      d = {
        $match: {
          $or: [
            { 'artists.name': { $regex: `${body.filter[1]}`, $options: 'i' } },
            { 'sites.name': { $regex: `${body.filter[1]}`, $options: 'i' } },
            { 'styles.name': { $regex: `${body.filter[1]}`, $options: 'i' } },
          ],
        },
      };
    } else {
      d = {
        $match: {
          [body.filter[0] === 'styles' ? 'styles.name' : body.filter[0]]:
            body.filter[1],
        },
      };
    }
    data.push(d);
  }
  return data;
};

const addProject = (data: any[]) => {
  data.push({
    $project: {
      _id: 1,
      name: 1,
      address: 1,
      styles: 1,
      image: 1,
      type: 1,
      info: 1,
      slug: 1,
      social: 1,
      updated: 1,
      created: 1,
    },
  });
  return data;
};
