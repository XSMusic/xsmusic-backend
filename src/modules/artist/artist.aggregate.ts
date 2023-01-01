import { ArtistGetAllForEventDto } from '@artist';
import { GetAllDto, GetOneDto } from '@dtos';
import { getOrderForGetAllAggregate, getFilter } from '@utils';
import mongoose from 'mongoose';

export const artistGetAllAggregate = (
  body: GetAllDto,
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
  if (body.hiddenSocial && body.hiddenSocial === true) {
    data.push({
      $unset: ['social'],
    });
  }
  return data;
};

export const artistGetAllForType = (
  body: ArtistGetAllForEventDto,
  skip: number,
  pageSize: number
) => {
  const data = [];
  data.push(
    {
      $lookup: {
        from: 'events',
        localField: '_id',
        foreignField: 'artists',
        as: 'events',
      },
    },
    { $skip: skip },
    { $limit: pageSize }
  );
  return data;
};

export const artistGetOneAggregate = (body: GetOneDto): any => {
  let data = [];
  const match =
    body.type === 'id' ? new mongoose.Types.ObjectId(body.value) : body.value;
  data.push({ $match: { [body.type === 'id' ? '_id' : 'slug']: match } });
  data = addLookups(data, true);
  return data;
};

const addLookups = (data: any[], one: boolean) => {
  data.push(
    {
      $lookup: {
        from: 'styles',
        localField: 'styles',
        foreignField: '_id',
        as: 'styles',
        pipeline: [{ $project: { _id: one ? 1 : 0, name: 1 } }],
      },
    },
    {
      $lookup: {
        from: 'images',
        localField: '_id',
        foreignField: 'artist',
        as: 'images',
        pipeline: [
          { $sort: { position: 1 } },
          { $project: { _id: 0, url: 1, type: 1 } },
        ],
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: '_id',
        foreignField: 'artists',
        as: 'sets',
        pipeline: getPipeline('set'),
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: '_id',
        foreignField: 'artists',
        as: 'tracks',
        pipeline: getPipeline('track'),
      },
    },
    {
      $lookup: {
        from: 'events',
        localField: '_id',
        foreignField: 'artists',
        as: 'events',
        pipeline: getPipeline('event'),
      },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'artist',
        as: 'followers',
        pipeline: getPipeline('like'),
      },
    }
  );
  data.push(
    { $unwind: { path: '$sets', preserveNullAndEmptyArrays: true } },
    { $unwind: { path: '$tracks', preserveNullAndEmptyArrays: true } },
    { $unwind: { path: '$events', preserveNullAndEmptyArrays: true } },
    { $unwind: { path: '$followers', preserveNullAndEmptyArrays: true } }
  );
  return data;
};

const getPipeline = (type: string) => {
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
  return pipelineCount;
};
