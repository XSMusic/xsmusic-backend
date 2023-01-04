import { GetAllDto, GetOneDto } from '@dtos';
import { UserGetAllDto } from '@user';
import { getOrderForGetAllAggregate } from '@utils';
import mongoose from 'mongoose';

export const userGetAllAggregate = (
  body: UserGetAllDto,
  skip: number,
  pageSize: number
): any => {
  const sort = getOrderForGetAllAggregate(body);
  let data: any = [];
  data = addLookups(data);
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
        images: 1,
        email: 1,
        role: 1,
        lastLogin: 1,
        created: 1,
        updated: 1,
      },
    }
  );

  return data;
};

export const userGetOneAggregate = (body: GetOneDto): any => {
  let data = [];
  const match =
    body.type === 'id' ? new mongoose.Types.ObjectId(body.value) : body.value;
  data.push({ $match: { [body.type === 'id' ? '_id' : 'slug']: match } });
  data = addLookups(data);
  return data;
};

const addLookups = (data: any[]) => {
  data.push({
    $lookup: {
      from: 'images',
      localField: '_id',
      foreignField: 'user',
      as: 'images',
      pipeline: [{ $sort: { position: 1 } }, { $project: { url: 1, type: 1 } }],
    },
  });
  return data;
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
