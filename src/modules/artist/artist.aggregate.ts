import { ArtistGetAllDto } from '@artist';
import { SearchDto } from '@dtos';
import { getOrderForGetAllAggregate } from '@utils';
import mongoose from 'mongoose';
import util from 'util';

export const artistGetAllAggregate = (
  body: ArtistGetAllDto,
  skip: number,
  pageSize: number
): any => {
  const sort = getOrderForGetAllAggregate(body);
  let data: any = [];
  data = addStylesAndGroup(data);
  if (body.filter && body.filter.length === 2) {
    const d = {
      $match: {
        [body.filter[0] === 'styles' ? 'styles.name' : body.filter[0]]:
          body.filter[1],
      },
    };
    data.push(d);
  }
  data.push({ $sort: sort }, { $skip: skip }, { $limit: pageSize });
  data.push({
    $project: {
      _id: 1,
      name: 1,
      country: 1,
      birthdate: 1,
      styles: 1,
      image: 1,
      info: 1,
      slug: 1,
      gender: 1,
      social: 1,
      sets: 1,
      tracks: 1,
    },
  });
  console.log(util.inspect(data, { showHidden: false, depth: null }));
  return data;
};

export const artistGetOneAggregate = (type: string, value: string): any => {
  let data = [];
  const match = type === '_id' ? new mongoose.Types.ObjectId(value) : value;
  data.push({ $match: { [type]: match } });
  data = addStylesAndGroup(data);
  return data;
};

export const artistSearchAggregate = (data: SearchDto): any => [
  {
    $match: {
      $or: [
        { name: { $regex: `${data.value}`, $options: 'i' } },
        { birthdate: { $regex: `${data.value}`, $options: 'i' } },
        { country: { $regex: `${data.value}`, $options: 'i' } },
        {
          'styles.name': { $regex: `${data.value}`, $options: 'i' },
        },
      ],
    },
  },
];

const addStylesAndGroup = (data: any[]) => {
  data.push(
    {
      $lookup: {
        from: 'styles',
        localField: 'styles',
        foreignField: '_id',
        as: 'styles',
        pipeline: [{ $project: { _id: 1, name: 1 } }],
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: '_id',
        foreignField: 'artists',
        as: 'sets',
        pipeline: [
          {
            $match: { $or: [{ type: 'set' }] },
          },
          { $count: 'count' },
          { $project: { count: 1, _id: 0 } },
        ],
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: '_id',
        foreignField: 'artists',
        as: 'tracks',
        pipeline: [
          {
            $match: { $or: [{ type: 'track' }] },
          },
          { $count: 'count' },
          { $project: { count: 1, _id: 0 } },
        ],
      },
    },
    { $unwind: { path: '$sets', preserveNullAndEmptyArrays: true } },
    { $unwind: { path: '$tracks', preserveNullAndEmptyArrays: true } }
  );
  return data;
};
