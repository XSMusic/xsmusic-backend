import { GetAllDto } from '@dtos';
import { UserGetAllDto } from '@user';
import { getOrderForGetAllAggregate } from '@utils';

export const userGetAllAggregate = (
  body: UserGetAllDto,
  skip: number,
  pageSize: number
): any => {
  const sort = getOrderForGetAllAggregate(body);
  let data: any = [];
  data = setFilter(body, data);
  data.push(
    { $sort: sort },
    { $skip: skip },
    { $limit: pageSize },
    {
      $project: {
        _id: 1,
        name: 1,
        country: 1,
        image: 1,
        email: 1,
        role: 1,
        created: 1,
        updated: 1,
      },
    }
  );
};

const setFilter = (body: GetAllDto, data: any) => {
  if (body.filter && body.filter.length === 2) {
    data.push({
      $match: {
        $or: [{ name: { $regex: `${body.filter[1]}`, $options: 'i' } }],
      },
    });
  }
  return data;
};
