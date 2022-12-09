import mongoose from 'mongoose';
import { EventGetAllDto, EventGetAllForTypeDto } from '@event';
import { getOrderForGetAllAggregate, getFilter } from '@utils';

export const eventGetAllAggregate = (
  body: EventGetAllDto,
  paginator = true,
  skip?: number,
  pageSize?: number
): any => {
  let data: any = [];
  data = allNoMapAggregate(body, paginator, skip, pageSize);
  return data;
};

const allNoMapAggregate = (
  body: EventGetAllDto,
  paginator: boolean,
  skip: number,
  pageSize: number
) => {
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

  data = addLookups(data, false, false);
  const filter = getFilter('event', body);
  if (filter) {
    data.push(filter);
  }
  if (paginator) {
    data.push({ $sort: sort }, { $skip: skip }, { $limit: pageSize });
  }
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
  return data;
};

export const eventGetOneAggregate = (
  type: 'id' | 'slug',
  value: string
): any => {
  let data = [];
  const match = type === 'id' ? new mongoose.Types.ObjectId(value) : value;
  data.push({ $match: { [type === 'id' ? '_id' : 'slug']: match } });
  data = addLookups(data, true, true);
  return data;
};

const addLookups = (data: any[], one: boolean, complete: boolean) => {
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
                { $project: { url: 1, type: 1 } },
              ],
            },
          },
          {
            $project: { _id: 1, name: 1, images: { url: 1, type: 1 }, slug: 1 },
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
          { $project: { url: 1, type: 1 } },
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
                { $project: { url: 1, type: 1 } },
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
              social: one ? 1 : -1,
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

export const eventGetAllForType = (
  body: EventGetAllForTypeDto,
  paginator = true,
  skip?: number,
  pageSize?: number
): any => {
  const data = [];
  data.push(
    {
      $match: {
        $and: [
          { [body.type]: new mongoose.Types.ObjectId(body.id) },
          {
            date: body.old
              ? { $lt: new Date().toISOString() }
              : { $gte: new Date().toISOString() },
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
          { $project: { _id: 0, url: 1, type: 1 } },
        ],
      },
    },
    {
      $lookup: {
        from: 'artists',
        localField: 'artists',
        foreignField: '_id',
        as: 'artists',
        pipeline: [{ $project: { _id: 0, name: 1 } }],
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
                { $project: { url: 1, type: 1 } },
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
    { $unwind: '$site' },
    {
      $sort: { date: 1 },
    }
  );
  if (paginator) {
    data.push({ $skip: skip }, { $limit: pageSize });
  }
  data.push({
    $project: {
      _id: 1,
      name: 1,
      date: 1,
      site: 1,
      slug: 1,
      artists: 1,
      images: 1,
      created: 1,
      updated: 1,
    },
  });
  return data;
};
