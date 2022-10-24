import { ArtistGetAllDto } from '@artist';
import { SearchDto } from '@dtos';
import { getOrderForGetAllAggregate } from '@utils';
import mongoose from 'mongoose';

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
  { $unwind: '$styles' },
  {
    $lookup: {
      from: 'styles',
      localField: 'styles',
      foreignField: '_id',
      as: 'stylesObj',
      pipeline: [{ $project: { _id: 1, name: 1 } }],
    },
  },
  { $unwind: '$stylesObj' },
  {
    $group: {
      _id: '$_id',
      name: { $first: '$name' },
      country: { $first: '$country' },
      birthdate: { $first: '$birthdate' },
      styles: { $push: '$stylesObj' },
      image: { $first: '$image' },
      info: { $first: '$info' },
      slug: { $first: '$slug' },
      gender: { $first: '$gender' },
      created: { $first: '$created' },
      updated: { $first: '$updated' },
    },
  },
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
    { $unwind: '$styles' },
    {
      $lookup: {
        from: 'styles',
        localField: 'styles',
        foreignField: '_id',
        as: 'stylesObj',
        pipeline: [{ $project: { _id: 1, name: 1 } }],
      },
    },
    { $unwind: '$stylesObj' },
    {
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        country: { $first: '$country' },
        birthdate: { $first: '$birthdate' },
        styles: { $push: '$stylesObj' },
        gender: { $first: '$gender' },
        image: { $first: '$image' },
        info: { $first: '$info' },
        slug: { $first: '$slug' },
        created: { $first: '$created' },
        updated: { $first: '$updated' },
      },
    }
  );
  return data;
};
