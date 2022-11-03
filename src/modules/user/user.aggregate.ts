import { GetAllDto } from '@dtos';
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
