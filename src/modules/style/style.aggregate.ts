import { SearchDto } from '@dtos';
import { StyleGetAllDto } from '@style';
import { getOrderForGetAllAggregate } from '@utils';

export const styleGetAllAggregate = (
  body: StyleGetAllDto,
  skip: number,
  pageSize: number
): any => {
  const sort = getOrderForGetAllAggregate(body);
  const data: any = [{ $sort: sort }, { $skip: skip }, { $limit: pageSize }];
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
      { $unwind: '$artists' },
      {
        $project: {
          _id: 1,
          name: 1,
          artists: 1,
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

  return data;
};

export const styleSearchAggregate = (data: SearchDto): any => [
  {
    $match: {
      $or: [{ name: { $regex: `${data.value}`, $options: 'i' } }],
    },
  },
];
