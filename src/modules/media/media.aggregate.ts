import { MediaGetAllDto } from '@media';
import { getOrderForGetAllAggregate } from '@utils';
import mongoose from 'mongoose';

export const mediaGetAllAggregate = (
  body: MediaGetAllDto,
  skip: number,
  pageSize: number
): any => {
  const sort = getOrderForGetAllAggregate(body);
  let data: any = [];
  data = addLookups(data);
  data.push({
    $match: { type: body.type },
  });
  if (body.filter && body.filter.length === 2) {
    switch (body.filter[0]) {
      case 'styles':
        data.push({ $match: { 'styles.name': body.filter[1] } });
        break;
      case 'artists':
        data.push({ $match: { 'artist.name': body.filter[1] } });
        break;
      default:
        data.push({ $match: { [body.filter[0]]: body.filter[1] } });
        break;
    }
  }
  data.push({ $sort: sort }, { $skip: skip }, { $limit: pageSize });
  data = addProject(data);
  return data;
};

export const mediaGetOneAggregate = (type: string, value: string): any => {
  let data = [];
  const match = type === '_id' ? new mongoose.Types.ObjectId(value) : value;
  data.push({ $match: { [type]: match } });
  data = addLookups(data);
  return data;
};

const addLookups = (data: any[]) => {
  data.push(
    {
      $lookup: {
        from: 'styles',
        localField: 'styles',
        foreignField: '_id',
        as: 'styles',
        pipeline: [{ $project: { _id: 1, name: 1, colors: 1 } }],
      },
    },
    {
      $lookup: {
        from: 'artists',
        localField: 'artists',
        foreignField: '_id',
        as: 'artists',
        pipeline: [
          { $project: { _id: 1, name: 1, image: 1, country: 1, slug: 1 } },
        ],
      },
    },
    {
      $lookup: {
        from: 'sites',
        localField: 'site',
        foreignField: '_id',
        as: 'site',
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              address: 1,
              type: 1,
              image: 1,
              slug: 1,
            },
          },
        ],
      },
    },
    { $unwind: '$site' }
  );
  return data;
};

const addProject = (data: any[]) => {
  data.push({
    $project: {
      _id: 1,
      name: 1,
      artists: 1,
      styles: 1,
      site: 1,
      source: 1,
      sourceId: 1,
      image: 1,
      info: 1,
      year: 1,
      type: 1,
      slug: 1,
      created: 1,
      updated: 1,
    },
  });
  return data;
};
