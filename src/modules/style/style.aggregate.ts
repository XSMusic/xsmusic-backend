import { GetAllDto } from '@dtos';
import { getOrderForGetAllAggregate } from '@utils';
import mongoose from 'mongoose';

export const styleGetAllAggregate = (
  body: GetAllDto,
  skip: number,
  pageSize: number
): any => {
  const sort = getOrderForGetAllAggregate(body);
  let data: any = [];
  data = addLookups(data, true);

  if (body.filter && body.filter.length === 2) {
    data.push({
      $match: {
        [body.filter[0]]: { $regex: `${body.filter[1]}`, $options: 'i' },
      },
    });
  }
  data.push({ $sort: sort }, { $skip: skip }, { $limit: pageSize });
  data.push({
    $project: {
      _id: 1,
      name: 1,
      artists: { $size: '$sets' },
      sets: { $size: '$sets' },
      tracks: { $size: '$tracks' },
      clubs: { $size: '$clubs' },
      festivals: { $size: '$festivals' },
      events: { $size: '$events' },
    },
  });
  return data;
};

export const styleGetOneAggregate = (value: string): any => {
  let data = [];
  data.push({ $match: { _id: new mongoose.Types.ObjectId(value) } });
  data = addLookups(data, true);
  return data;
};

const addLookups = (data: any[], complete: boolean) => {
  data.push(
    {
      $lookup: {
        from: 'artists',
        localField: '_id',
        foreignField: 'styles',
        as: 'artists',
        pipeline: getPipeline('artist', complete),
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: '_id',
        foreignField: 'styles',
        as: 'sets',
        pipeline: getPipeline('set', complete),
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: '_id',
        foreignField: 'styles',
        as: 'tracks',
        pipeline: getPipeline('track', complete),
      },
    },
    {
      $lookup: {
        from: 'sites',
        localField: '_id',
        foreignField: 'styles',
        as: 'clubs',
        pipeline: getPipeline('club', complete),
      },
    },
    {
      $lookup: {
        from: 'sites',
        localField: '_id',
        foreignField: 'styles',
        as: 'festivals',
        pipeline: getPipeline('festival', complete),
      },
    },
    {
      $lookup: {
        from: 'events',
        localField: '_id',
        foreignField: 'styles',
        as: 'events',
        pipeline: getPipeline('event', complete),
      },
    }
  );

  return data;
};

const getPipeline = (type: string, complete: boolean) => {
  const pipelineCount = [];
  if (
    type === 'set' ||
    type === 'track' ||
    type === 'club' ||
    type === 'festival'
  ) {
    pipelineCount.push({ $match: { $or: [{ type: type }] } });
  }
  pipelineCount.push({ $count: 'count' }, { $project: { count: 1, _id: 0 } });
  const styleLookup = {
    $lookup: {
      from: 'styles',
      localField: 'styles',
      foreignField: '_id',
      as: 'styles',
      pipeline: [{ $project: { _id: 1, name: 1, colors: 1 } }],
    },
  };
  const pipelineNotCount =
    type === 'set' || type === 'track' || type === 'club' || type === 'festival'
      ? [
          { $match: { $or: [{ type: type }] } },
          {
            $lookup: {
              from: 'images',
              localField: '_id',
              foreignField:
                type === 'set' || type === 'track' ? 'media' : 'site',
              as: 'images',
              pipeline: [
                { $project: { _id: 1, url: 1, position: 1 } },
                { $sort: { position: 1 } },
              ],
            },
          },
          {
            $lookup: {
              from: 'artists',
              localField: '_id',
              foreignField: 'artists',
              as: 'artists',
              pipeline: [
                { $project: { _id: 1, name: 1, country: 1 } },
                { $sort: { position: 1 } },
              ],
            },
          },
          styleLookup,
        ]
      : [
          styleLookup,
          {
            $lookup: {
              from: 'images',
              localField: '_id',
              foreignField: 'artist',
              as: 'images',
              pipeline: [
                { $project: { _id: 1, url: 1, position: 1 } },
                { $sort: { position: 1 } },
              ],
            },
          },
        ];
  return complete ? pipelineNotCount : pipelineCount;
};
