import { SearchDto } from '@dtos';
import { StyleGetAllDto } from '@style';
import { getOrderForGetAllAggregate } from '@utils';

export const styleGetAllAggregate = (
  body: StyleGetAllDto,
  skip: number,
  pageSize: number
): any => {
  const sort = getOrderForGetAllAggregate(body);
  const data: any = [];
  if (body.complete) {
    data.push(
      {
        $lookup: {
          from: 'artists',
          localField: '_id',
          foreignField: 'styles',
          as: 'artists',
          pipeline: [{ $count: 'count' }, { $project: { count: 1, _id: 0 } }],
        },
      },
      {
        $lookup: {
          from: 'media',
          localField: '_id',
          foreignField: 'styles',
          as: 'sets',
          pipeline: [
            { $match: { $or: [{ type: 'set' }] } },
            { $count: 'count' },
            { $project: { count: 1, _id: 0 } },
          ],
        },
      },
      {
        $lookup: {
          from: 'media',
          localField: '_id',
          foreignField: 'styles',
          as: 'tracks',
          pipeline: [
            { $match: { $or: [{ type: 'track' }] } },
            { $count: 'count' },
            { $project: { count: 1, _id: 0 } },
          ],
        },
      },
      { $unwind: { path: '$artists', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$sets', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$tracks', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          name: 1,
          artists: 1,
          sets: 1,
          tracks: 1,
        },
      }
    );
  } else {
    data.push({
      $project: {
        _id: 1,
        name: 1,
      },
    });
  }
  if (body.filter && body.filter.length === 2) {
    data.push({ $match: { [body.filter[0]]: body.filter[1] } });
  }
  data.push({ $sort: sort }, { $skip: skip }, { $limit: pageSize });
  return data;
};

export const styleSearchAggregate = (data: SearchDto): any => [
  {
    $match: {
      $or: [{ name: { $regex: `${data.value}`, $options: 'i' } }],
    },
  },
];
