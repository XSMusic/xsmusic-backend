import mongoose from 'mongoose';
import { GetAllDto } from '@dtos';
import { EventGetAllDto } from '@event';
import { getOrderForGetAllAggregate } from '@utils';
import { inspect } from 'src/shared/services/logger.service';

export const eventGetAllAggregate = (
  body: EventGetAllDto,
  skip: number,
  pageSize: number
): any => {
  const sort = getOrderForGetAllAggregate(body);
  let data: any = [];
  if (body.old) {
    data.push({
      $match: {
        date: { $lt: new Date().toISOString() },
      },
    });
  } else {
    data.push({
      $match: {
        date: { $gte: new Date().toISOString() },
      },
    });
  }

  data = addLookups(data, false);
  data = setFilter(body, data);
  data.push({ $sort: sort }, { $skip: skip }, { $limit: pageSize });
  data.push({
    $project: {
      _id: 1,
      name: 1,
      date: 1,
      site: 1,
      styles: 1,
      artists: 1,
      images: 1,
      info: 1,
      slug: 1,
      updated: 1,
      created: 1,
    },
  });
  inspect(data);
  return data;
};

export const eventGetOneAggregate = (
  type: 'id' | 'slug',
  value: string
): any => {
  let data = [];
  const match = type === 'id' ? new mongoose.Types.ObjectId(value) : value;
  data.push({ $match: { [type === 'id' ? '_id' : 'slug']: match } });
  data = addLookups(data, true);
  return data;
};

const addLookups = (data: any[], complete: boolean) => {
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
          {
            $lookup: {
              from: 'images',
              localField: '_id',
              foreignField: 'artist',
              as: 'images',
              pipeline: [
                { $sort: { position: 1 } },
                { $project: { _id: 1, url: 1, position: 1 } },
              ],
            },
          },
          {
            $project: { _id: 1, name: 1, images: { url: 1 }, slug: 1 },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'images',
        localField: '_id',
        foreignField: 'event',
        as: 'images',
        pipeline: [
          { $sort: { position: 1 } },
          { $project: { _id: 1, url: 1, position: 1 } },
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
            $lookup: {
              from: 'images',
              localField: '_id',
              foreignField: 'site',
              as: 'images',
              pipeline: [
                { $project: { _id: 1, url: 1, position: 1 } },
                { $sort: { position: 1 } },
              ],
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              address: 1,
              type: 1,
              images: 1,
              slug: 1,
            },
          },
        ],
      },
    },
    { $unwind: '$site' }
  );
  if (!complete) {
    data.push(
      { $unwind: { path: '$sets', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$tracks', preserveNullAndEmptyArrays: true } }
    );
  }
  return data;
};

const setFilter = (body: GetAllDto, data: any) => {
  if (body.filter && body.filter.length === 2) {
    let d = {};
    if (body.filter[0] === 'name') {
      d = {
        $match: {
          $or: [
            { name: { $regex: `${body.filter[1]}`, $options: 'i' } },
            { birthdate: { $regex: `${body.filter[1]}`, $options: 'i' } },
            { country: { $regex: `${body.filter[1]}`, $options: 'i' } },
            {
              'styles.name': { $regex: `${body.filter[1]}`, $options: 'i' },
            },
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
