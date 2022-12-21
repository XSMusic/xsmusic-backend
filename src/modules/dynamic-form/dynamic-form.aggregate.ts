import { GetAllDto } from '@dtos';
import { getOrderForGetAllAggregate } from '@utils';
import mongoose from 'mongoose';

export const dynamicFormGetAllAggregate = (
  body: GetAllDto,
  skip: number,
  pageSize: number
) => {
  const sort = getOrderForGetAllAggregate(body);
  const data: any = [
    {
      $lookup: {
        from: 'dynamicformitems',
        localField: '_id',
        foreignField: 'form',
        as: 'items',
      },
    },
  ];
  data.push({ $sort: sort }, { $skip: skip }, { $limit: pageSize });
  return data;
};

export const dynamicFormGetOneAggregate = (id: string) => {
  const data: any = [
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: 'dynamicformitems',
        localField: '_id',
        foreignField: 'form',
        as: 'items',
      },
    },
  ];
  return data;
};
