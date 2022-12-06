import { ArtistGetAllDto } from '@artist';
import { getOrderForGetAllAggregate, getFilter } from '@utils';
import mongoose from 'mongoose';

export const artistGetAllAggregate = (
  body: ArtistGetAllDto,
  skip: number,
  pageSize: number
): any => {
  const sort = getOrderForGetAllAggregate(body);
  let data: any = [];
  data = addLookups(data, false);
  const filter = getFilter('artist', body);
  if (filter) {
    data.push(filter);
  }
  data.push({ $sort: sort }, { $skip: skip }, { $limit: pageSize });
  data.push({
    $project: {
      _id: 1,
      name: 1,
      country: 1,
      birthdate: 1,
      styles: 1,
      images: 1,
      info: 1,
      slug: 1,
      gender: 1,
      social: 1,
      sets: 1,
      tracks: 1,
      events: 1,
      updated: 1,
      created: 1,
    },
  });
  return data;
};

export const artistGetOneAggregate = (
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
        from: 'images',
        localField: '_id',
        foreignField: 'artist',
        as: 'images',
        pipeline: [
          { $project: { url: 1, type: 1 } },
          { $sort: { position: 1 } },
        ],
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: '_id',
        foreignField: 'artists',
        as: 'sets',
        pipeline: getPipeline('set', complete),
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: '_id',
        foreignField: 'artists',
        as: 'tracks',
        pipeline: getPipeline('track', complete),
      },
    },
    {
      $lookup: {
        from: 'events',
        localField: '_id',
        foreignField: 'artists',
        as: 'events',
        pipeline: getPipeline('event', complete),
      },
    }
  );
  if (!complete) {
    data.push(
      { $unwind: { path: '$sets', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$tracks', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$events', preserveNullAndEmptyArrays: true } }
    );
  }
  return data;
};

const getPipeline = (type: string, complete: boolean) => {
  let pipelineCount: any = [
    { $match: { $or: [{ type: type }] } },
    { $count: 'count' },
    { $project: { count: 1, _id: 0 } },
  ];
  if (type === 'event') {
    pipelineCount = [
      {
        $match: {
          date: { $gte: new Date().toISOString() },
        },
      },
      { $count: 'count' },
      { $project: { count: 1, _id: 0 } },
    ];
  }
  const pipelineComplete = [];
  if (type !== 'event') {
    pipelineComplete.push({
      $match: {
        $or: [{ type: type }],
      },
    });
  } else {
    pipelineComplete.push({
      $match: {
        date: { $gte: new Date().toISOString() },
      },
    });
  }
  pipelineComplete.push(
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
          { $project: { _id: 1, name: 1, images: 1, date: 1, address: 1 } },
        ],
      },
    },
    {
      $lookup: {
        from: 'images',
        localField: '_id',
        foreignField: type === 'event' ? 'event' : 'media',
        as: 'images',
        pipeline: [
          { $project: { url: 1, type: 1 } },
          { $sort: { position: 1 } },
        ],
      },
    },
    { $unwind: '$site' },
    { $sort: { created: -1 } }
  );
  return complete ? pipelineComplete : pipelineCount;
};
