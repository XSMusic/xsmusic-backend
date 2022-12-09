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
  data.push({ $sort: sort }, { $skip: skip }, { $limit: pageSize });
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
            $project: { _id: 1, name: 1, country: 1, slug: 1 },
          },
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
            $project: { _id: 1, name: 1, slug: 1 },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: 'media',
        foreignField: '_id',
        as: 'media',
        pipeline: [
          {
            $project: { _id: 1, name: 1, slug: 1, type: 1 },
          },
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
            $project: { _id: 1, name: 1, slug: 1, type: 1 },
          },
        ],
      },
    },
    {
      $unwind: { path: '$artist', preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: { path: '$event', preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: { path: '$media', preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: { path: '$site', preserveNullAndEmptyArrays: true },
    }
  );
  return data;
};
