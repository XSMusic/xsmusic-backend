import { ArtistGetAllDto } from '@artist';
import { getOrderForGetAllAggregate } from '@utils';
import mongoose from 'mongoose';

export const artistGetAllAggregate = (
  body: ArtistGetAllDto,
  skip: number,
  pageSize: number
): any => {
  const sort = getOrderForGetAllAggregate(body);
  let data: any = [];
  data = addLookups(data, false);
  data = setFilter(body, data);
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
      updated: 1,
      created: 1,
    },
  });
  return data;
};

export const artistGetOneAggregate = (type: string, value: string): any => {
  let data = [];
  const match = type === '_id' ? new mongoose.Types.ObjectId(value) : value;
  data.push({ $match: { [type]: match } });
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
    }
  );
  if (!complete) {
    data.push(
      { $unwind: { path: '$sets', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$tracks', preserveNullAndEmptyArrays: true } }
    );
  }
  return data;
};

const setFilter = (body: ArtistGetAllDto, data: any) => {
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

const getPipeline = (type: string, complete: boolean) => {
  const pipelineCount = [
    { $match: { $or: [{ type: type }] } },
    { $count: 'count' },
    { $project: { count: 1, _id: 0 } },
  ];
  const pipelineNotCount = [
    { $match: { $or: [{ type: type }] } },
    { $sort: { created: 1 } },
  ];
  return complete ? pipelineNotCount : pipelineCount;
};
