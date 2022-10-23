import { GetAllDto, SearchDto } from '@dtos';
import { getOrderForGetAllAggregate } from '@utils';

export const userGetAllAggregate = (
  body: GetAllDto,
  skip: number,
  pageSize: number
): any => {
  const sort = getOrderForGetAllAggregate(body);
  return [
    { $sort: sort },
    { $skip: skip },
    { $limit: pageSize },
    {
      $project: {
        _id: 1,
        name: 1,
        country: 1,
        email: 1,
        role: 1,
        created: 1,
        updated: 1,
      },
    },
  ];
};

export const userSearchAggregate = (data: SearchDto): any => [
  {
    $match: {
      $or: [
        { name: { $regex: `${data.value}`, $options: 'i' } },
        { email: { $regex: `${data.value}`, $options: 'i' } },
        { country: { $regex: `${data.value}`, $options: 'i' } },
        { role: { $regex: `${data.value}`, $options: 'i' } },
      ],
    },
  },
];
