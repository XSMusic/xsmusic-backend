import { GetAllDto, GetOneDto } from '@dtos';
import { getOrderForGetAllAggregate } from '@utils';
import mongoose from 'mongoose';

export const likeGetAllAggregate = (
  body: GetAllDto,
  skip: number,
  pageSize: number
): any => {
  const sort = getOrderForGetAllAggregate(body);
  let data: any = [];
  data = addLookups(data);
  data.push({ $sort: sort }, { $skip: skip }, { $limit: pageSize });
  data.push({
    $project: {
      _id: 1,
      type: 1,
      subType: 1,
      artist: 1,
      event: 1,
      media: 1,
      site: 1,
      user: 1,
      updated: 1,
      created: 1,
    },
  });
  return data;
};

const addLookups = (data: any[]) => {
  data.push(
    {
      $lookup: {
        from: 'artists',
        localField: 'artist',
        foreignField: '_id',
        as: 'artist',
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
          { $project: { name: 1, images: 1, slug: 1, country: 1 } },
        ],
      },
    },
    {
      $lookup: {
        from: 'events',
        localField: 'event',
        foreignField: '_id',
        as: 'event',
        pipeline: [
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
          { $project: { name: 1, images: 1, slug: 1 } },
        ],
      },
    },
    {
      $lookup: {
        from: 'medias',
        localField: 'media',
        foreignField: '_id',
        as: 'media',
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $lookup: {
        from: 'sites',
        localField: 'site',
        foreignField: '_id',
        as: 'site',
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
        pipeline: [
          {
            $lookup: {
              from: 'images',
              localField: '_id',
              foreignField: 'user',
              as: 'images',
              pipeline: [
                { $sort: { position: 1 } },
                { $project: { url: 1, type: 1 } },
              ],
            },
          },
          { $project: { name: 1, images: 1 } },
        ],
      },
    },
    { $unwind: { path: '$artist', preserveNullAndEmptyArrays: true } },
    { $unwind: { path: '$event', preserveNullAndEmptyArrays: true } },
    { $unwind: { path: '$media', preserveNullAndEmptyArrays: true } },
    { $unwind: { path: '$site', preserveNullAndEmptyArrays: true } },
    { $unwind: { path: '$user' } }
  );
  return data;
};

export const likeGetOneAggregate = (body: GetOneDto): any => {
  let data = [];
  data.push({ $match: { _id: new mongoose.Types.ObjectId(body.value) } });
  data = addLookups(data);
  return data;
};
